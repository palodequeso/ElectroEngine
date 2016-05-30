"use strict";

var View = require('../../lib/view.js');
var glmatrix = require("gl-matrix");
var View = require('../../lib/view.js');
var util = require('../util/util.js');

var textured_quad_shader_vert_source = '' +
    'attribute vec4 vertex_position;' +
    'attribute vec4 vertex_texcoord;' +
    'uniform mat4 projection_matrix;' +
    'uniform mat4 view_matrix;' +
    'uniform mat4 model_matrix;' +
    'uniform vec4 sprite_texcoord;' +
    'uniform vec2 sprite_size;' +
    'varying vec2 texcoord;' +
    'void main(void) {' +
    '    gl_Position = projection_matrix * view_matrix * model_matrix * vertex_position;' +
    '    vec2 texcoord_out = sprite_texcoord.st;' +
    '    if (vertex_texcoord.s > 0.5) {' +
    '        texcoord_out.s = sprite_texcoord.z;' +
    '    }' +
    '    if (vertex_texcoord.t > 0.5) {' +
    '        texcoord_out.t = sprite_texcoord.w;' +
    '    }' +
    '    texcoord_out /= sprite_size;' +
    '    texcoord = texcoord_out;' +
    '}';

var textured_quad_shader_frag_source = '' +
    'precision mediump float;' +
    'varying vec2 texcoord;' +
    'uniform sampler2D texture;' +
    'uniform vec4 color;' +
    'void main(void) {' +
    '    vec4 color_out = texture2D(texture, texcoord) * color;' +
    '    gl_FragColor = color_out;' +
    '}';


class Renderer extends View {
    constructor(options) {
        super(options);

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("width", "650px");
        this.canvas.setAttribute("height", "500px");
        this.$element.append(this.canvas);
        this.gl = this.canvas.getContext('webgl');
        this.max_texture_size = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);

        this.shaders = {};
        this.create_shaders();

        this.quad_vertices_buffer = null;
        this.quad_texcoords_buffer = null;
        this.quad_indices_buffer = null;
        this.use_vao = true;
        this.vao_ext = null;
        this.create_quad();

        this.projection_matrix = glmatrix.mat4.create();
        this.view_matrix = glmatrix.mat4.create();
        glmatrix.mat4.ortho(this.projection_matrix, 0.0, 650.0, 0.0, 500.0, -1.0, 1.0);
        glmatrix.mat4.identity(this.view_matrix);

        this.textures_preloaded = false;
        this.textures = {};
        this.load_sprite_images();

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    load_texture(image_src, callback) {
        var texture = this.gl.createTexture();
        texture.image = new Image();

        var t = this;
        texture.image.onload = function() {
            if (texture.image.width > t.max_texture_size || texture.image.height > t.max_texture_size) {
                console.error("The image being loaded is larger than the current WebGL's context MAX_TEXTURE_SIZE of ", t.max_texture_size);
            }
            t.gl.bindTexture(t.gl.TEXTURE_2D, texture);
            t.gl.pixelStorei(t.gl.UNPACK_FLIP_Y_WEBGL, false);
            t.gl.texImage2D(t.gl.TEXTURE_2D, 0, t.gl.RGBA, t.gl.RGBA, t.gl.UNSIGNED_BYTE, texture.image);
            t.gl.texParameteri(t.gl.TEXTURE_2D, t.gl.TEXTURE_MIN_FILTER, t.gl.NEAREST);
            t.gl.texParameteri(t.gl.TEXTURE_2D, t.gl.TEXTURE_WRAP_S, t.gl.CLAMP_TO_EDGE);
            t.gl.texParameteri(t.gl.TEXTURE_2D, t.gl.TEXTURE_WRAP_T, t.gl.CLAMP_TO_EDGE);
            t.gl.bindTexture(t.gl.TEXTURE_2D, null);
            callback(texture);
        };

        texture.image.src = image_src;
    }
    load_sprite_images() {
        var t = this;
        var images_loaded_statuses = {};
        var image_loaded_promises = [];

        this.model.map_instances.each((map_instance) => {
            map_instance.map.sprite_sheets.each((sprite_sheet) => {
                var image_src = sprite_sheet.path;
                if (!images_loaded_statuses.hasOwnProperty(image_src)) {
                    image_loaded_promises.push(new Promise((resolve, reject) => {
                        this.load_texture('data/sprite_sheets/' + image_src, (texture) => {
                            resolve({texture: texture, image_src: image_src});
                        });
                    }));
                    images_loaded_statuses[image_src] = true;
                }
            });
        });

        this.model.sprite_sheets.each((sprite_sheet) => {
            var image_src = sprite_sheet.path;
            if (!images_loaded_statuses.hasOwnProperty(image_src)) {
                image_loaded_promises.push(new Promise((resolve, reject) => {
                    this.load_texture('data/sprite_sheets/' + image_src, (texture) => {
                        resolve({texture: texture, image_src: image_src});
                    });
                }));
                images_loaded_statuses[image_src] = true;
            }
        });

        this.model.particle_system_instances.each((particle_system_instance) => {
            var particle_system = particle_system_instance.particle_system;
            var image_src = particle_system.image;
            if (!images_loaded_statuses.hasOwnProperty(image_src)) {
                image_loaded_promises.push(new Promise((resolve, reject) => {
                    this.load_texture('data/particles/' + image_src, (texture) => {
                        resolve({texture: texture, image_src: image_src});
                    });
                }));
                images_loaded_statuses[image_src] = true;
            }
        });

        Promise.all(image_loaded_promises).then((textures) => {
            textures.forEach((texture) => {
                this.textures[texture.image_src] = texture.texture;
                this.textures_preloaded = true;
            });
        });
    }
    create_quad() {
        var vertices = [
            0.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0
        ];
        var texcoords = [
            0.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0
        ];
        var indices = [0, 1, 2, 0, 2, 3];

        //http://blog.tojicode.com/2012/10/oesvertexarrayobject-extension.html
        if (this.use_vao) {
            this.vao_ext = this.gl.getExtension("OES_vertex_array_object");
            this.vao = this.vao_ext.createVertexArrayOES();

            // Start setting up VAO
            this.vao_ext.bindVertexArrayOES(this.vao);

            // Create some buffers
            this.quad_vertices_buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(this.shaders.textured_quad.vertex_position_attribute);
            this.gl.vertexAttribPointer(this.shaders.textured_quad.vertex_position_attribute, 4, this.gl.FLOAT, false, 0, 0);

            this.quad_texcoords_buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_texcoords_buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(this.shaders.textured_quad.texcoord_position_attribute);
            this.gl.vertexAttribPointer(this.shaders.textured_quad.texcoord_position_attribute, 4, this.gl.FLOAT, false, 0, 0);

            this.quad_indices_buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.quad_indices_buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

            // Finised setting up VAO
            this.vao_ext.bindVertexArrayOES(null);
        } else {
            this.quad_vertices_buffer = this.gl.createBuffer();
            this.quad_texcoords_buffer = this.gl.createBuffer();
            this.quad_indices_buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_texcoords_buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.quad_indices_buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        }
    }
    create_shader(type, source) {
        var shader;
        if (type == "frag") {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        } else if (type == "vert") {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        } else {
            return null;
        }

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    create_shaders() {
        this.shaders.textured_quad = {
            shader: null,
            vertex_position_attribute: 0,
            texcoord_position_attribute: 1,
            projection_matrix_location: null,
            view_matrix_location: null,
            model_matrix_location: null,
            sprite_texcoord_location: null,
            sprite_size_location: null,
            texture_location: null,
            color_location: null
        };
        this.shaders.textured_quad.shader = this.gl.createProgram();
        var vert_shader = this.create_shader("vert", textured_quad_shader_vert_source);
        var frag_shader = this.create_shader("frag", textured_quad_shader_frag_source);
        this.gl.attachShader(this.shaders.textured_quad.shader, vert_shader);
        this.gl.attachShader(this.shaders.textured_quad.shader, frag_shader);
        this.gl.linkProgram(this.shaders.textured_quad.shader);

        if (!this.gl.getProgramParameter(this.shaders.textured_quad.shader, this.gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
        }

        this.gl.useProgram(this.shaders.textured_quad.shader);
        this.shaders.textured_quad.vertex_position_attribute = this.gl.getAttribLocation(this.shaders.textured_quad.shader, "vertex_position");
        this.gl.enableVertexAttribArray(this.shaders.textured_quad.vertex_position_attribute);
        this.shaders.textured_quad.texcoord_position_attribute = this.gl.getAttribLocation(this.shaders.textured_quad.shader, "vertex_texcoord");
        this.gl.enableVertexAttribArray(this.shaders.textured_quad.texcoord_position_attribute);
        this.shaders.textured_quad.projection_matrix_location = this.gl.getUniformLocation(this.shaders.textured_quad.shader, "projection_matrix");
        this.shaders.textured_quad.view_matrix_location = this.gl.getUniformLocation(this.shaders.textured_quad.shader, "view_matrix");
        this.shaders.textured_quad.model_matrix_location = this.gl.getUniformLocation(this.shaders.textured_quad.shader, "model_matrix");
        this.shaders.textured_quad.sprite_texcoord_location = this.gl.getUniformLocation(this.shaders.textured_quad.shader, "sprite_texcoord");
        this.shaders.textured_quad.sprite_size_location = this.gl.getUniformLocation(this.shaders.textured_quad.shader, "sprite_size");
        this.shaders.textured_quad.texture_location = this.gl.getUniformLocation(this.shaders.textured_quad.shader, "texture");
        this.shaders.textured_quad.color_location = this.gl.getUniformLocation(this.shaders.textured_quad.shader, "color");
    }
    draw_quad(position, dimensions, sprite_texcoord, color, texture, shader) {
        var model_matrix = glmatrix.mat4.create();
        glmatrix.mat4.translate(model_matrix, model_matrix, [position[0], this.canvas.height - position[1], 1.0]);
        glmatrix.mat4.scale(model_matrix, model_matrix, [dimensions[0], dimensions[1], 1.0]);
        this.gl.uniformMatrix4fv(shader.model_matrix_location, false, model_matrix);//new FloatArray(model_matrix));
        this.gl.uniform1i(shader.texture_location, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform2f(shader.sprite_size_location, texture.image.width, texture.image.height);
        this.gl.uniform4f(shader.color_location, color[0], color[1], color[2], color[3]);
        this.gl.uniform1i(shader.texture_location, 0);
        this.gl.uniform4f(shader.sprite_texcoord_location, sprite_texcoord[0], sprite_texcoord[3], sprite_texcoord[2], sprite_texcoord[1]);

        if (this.use_vao) {
            this.vao_ext.bindVertexArrayOES(this.vao);
            this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
            this.vao_ext.bindVertexArrayOES(null);
        } else {
            this.gl.enableVertexAttribArray(shader.vertex_position_attribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_vertices_buffer);
            this.gl.vertexAttribPointer(shader.vertex_position_attribute, 4, this.gl.FLOAT, false, 0, 0);

            this.gl.enableVertexAttribArray(shader.vertex_position_attribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad_texcoords_buffer);
            this.gl.vertexAttribPointer(shader.texcoord_position_attribute, 4, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.quad_indices_buffer);
            this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
        }
    }
    render() {
        if (!this.textures_preloaded) {
            return;
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.shaders.textured_quad.shader);
        this.gl.uniformMatrix4fv(this.shaders.textured_quad.projection_matrix_location, false, this.projection_matrix);
        this.gl.uniformMatrix4fv(this.shaders.textured_quad.view_matrix_location, false, this.view_matrix);

        this.model.map_instances.each((map_instance) => {
            var character_layer_index = map_instance.map.character_layer_index;
            map_instance.layer_instances.each((layer_instance, layer_id, layer_index) => {
                layer_instance.sprite_instances.each((sprite_instance) => {
                    var position = sprite_instance.position;
                    this.draw_quad(
                        [position[0], position[1] + sprite_instance.sprite.height],
                        [sprite_instance.sprite.width, sprite_instance.sprite.height],
                        [
                            sprite_instance.tile.css_offset_x,
                            sprite_instance.tile.css_offset_y,
                            sprite_instance.tile.css_offset_x + sprite_instance.sprite.width,
                            sprite_instance.tile.css_offset_y + sprite_instance.sprite.height
                        ],
                        [1, 1, 1, sprite_instance.opacity],
                        this.textures[sprite_instance.sprite.sprite_path],
                        this.shaders.textured_quad
                    );
                });

                if (layer_index === (character_layer_index - 1)) {
                    map_instance.character_instances.each((character_instance) => {
                        var sprite_instance = character_instance.sprite_instance;
                        var position = sprite_instance.position;
                        this.draw_quad(
                            [position[0], position[1] + sprite_instance.sprite.height],
                            [sprite_instance.sprite.width, sprite_instance.sprite.height],
                            [
                                sprite_instance.tile.css_offset_x,
                                sprite_instance.tile.css_offset_y,
                                sprite_instance.tile.css_offset_x + sprite_instance.sprite.width,
                                sprite_instance.tile.css_offset_y + sprite_instance.sprite.height
                            ],
                            [1, 1, 1, sprite_instance.opacity],
                            this.textures[sprite_instance.sprite.sprite_path],
                            this.shaders.textured_quad
                        );
                    });
                }
            });
        });

        this.model.particle_system_instances.each((particle_system_instance) => {
            var particle_system = particle_system_instance.particle_system;
            var system_position = particle_system_instance.position;
            var image = particle_system.image;
            var texture = this.textures[image];
            var shader = this.shaders.textured_quad;

            var modifier = particle_system.modifier;
            if (!modifier) {
                modifier = function(particle_data) {
                    return particle_data;
                };
            }

            particle_system_instance.particles.forEach((particle) => {
                // var serialized = particle.serialize();
                // var data = JSON.parse(serialized);
                var data = particle;
                data.alpha = ((data.life < data.fade) ? data.life / data.fade : 1.0) / 2.0;
                // data = modifier(data);

                this.draw_quad(
                    [data.position[0] + system_position[0] + 250.0, data.position[1] + data.size[1] + system_position[1] + 250.0],
                    [data.size[0], data.size[1]],
                    [0.0, 0.0, texture.image.width, texture.image.height],
                    [data.color[0], data.color[1], data.color[2], data.alpha],
                    texture, shader
                );
            });
        });
    }
}

module.exports = Renderer
