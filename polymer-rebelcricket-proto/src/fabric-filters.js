var initFabricFilters = function(_this){
  
  fabric.Object.prototype.transparentCorners = false;
  // var _this.$$ = function(id){return document.getElementById(id)};

  function applyFilter(index, filter) {
    var obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    obj.applyFilters(canvas.renderAll.bind(canvas));
  }

  function applyFilterValue(index, prop, value) {
    var obj = canvas.getActiveObject();
    if (obj.filters[index]) {
      obj.filters[index][prop] = value;
      obj.applyFilters(canvas.renderAll.bind(canvas));
    }
  }

  fabric.Object.prototype.padding = 5;
  fabric.Object.prototype.transparentCorners = false;

  var canvas = this.__canvas = _this.canvas,
      f = fabric.Image.filters;

  // fabric.Image.fromURL('../lib/bg.png', function(img) {
  //   canvas.backgroundImage = img;
  //   canvas.backgroundImage.width = 600;
  //   canvas.backgroundImage.height = 600;
  // });


  canvas.on({
    'object:selected': function() {
      // fabric.util.toArray(document.getElementsByTagName('input'))
      //                     .forEach(function(el){ el.disabled = false; })

      var filters = ['grayscale', 'invert', 'remove-white', 'sepia', 'sepia2',
                      'brightness', 'contrast', 'saturate', 'noise', 'gradient-transparency', 'pixelate',
                      'blur', 'sharpen', 'emboss', 'tint', 'multiply', 'blend'];

      for (var i = 0; i < filters.length; i++) {
        _this.$$('#'+filters[i]).checked = !!canvas.getActiveObject().filters[i];
      }
    }
    // ,
    // 'selection:cleared': function() {
    //   fabric.util.toArray(document.getElementsByTagName('input'))
    //                       .forEach(function(el){ el.disabled = true; })
    // }
  });

  // fabric.Image.fromURL('../assets/printio.png', function(img) {
  //   var oImg = img.set({ left: 50, top: 100, angle: -15 }).scale(0.9);
  //   canvas.add(oImg).renderAll();
  //   canvas.setActiveObject(oImg);
  // });

  var indexF;
  _this.$$('#grayscale').onclick = function() {
    applyFilter(0, this.checked && new f.Grayscale());
  };
  _this.$$('#invert').onclick = function() {
    applyFilter(1, this.checked && new f.Invert());
  };
  _this.$$('#remove-white').onclick = function () {
    applyFilter(2, this.checked && new f.RemoveWhite({
      threshold: _this.$$('#remove-white-threshold').value,
      distance: _this.$$('#remove-white-distance').value
    }));
  };
  _this.$$('#remove-white-threshold').onchange = function() {
    applyFilterValue(2, 'threshold', this.value);
  };
  _this.$$('#remove-white-distance').onchange = function() {
    applyFilterValue(2, 'distance', this.value);
  };
  _this.$$('#sepia').onclick = function() {
    applyFilter(3, this.checked && new f.Sepia());
  };
  _this.$$('#sepia2').onclick = function() {
    applyFilter(4, this.checked && new f.Sepia2());
  };
  _this.$$('#brightness').onclick = function () {
    applyFilter(5, this.checked && new f.Brightness({
      brightness: parseInt(_this.$$('#brightness-value').value, 10)
    }));
  };
  _this.$$('#brightness-value').onchange = function() {
    applyFilterValue(5, 'brightness', parseInt(this.value, 10));
  };
  _this.$$('#contrast').onclick = function () {
    applyFilter(6, this.checked && new f.Contrast({
      contrast: parseInt(_this.$$('#contrast-value').value, 10)
    }));
  };
  _this.$$('#contrast-value').onchange = function() {
    applyFilterValue(6, 'contrast', parseInt(this.value, 10));
  };
  _this.$$('#saturate').onclick = function () {
    applyFilter(7, this.checked && new f.Saturate({
      saturate: parseInt(_this.$$('#saturate-value').value, 10)
    }));
  };
  _this.$$('#saturate-value').onchange = function() {
    applyFilterValue(7, 'saturate', parseInt(this.value, 10));
  };
  _this.$$('#noise').onclick = function () {
    applyFilter(8, this.checked && new f.Noise({
      noise: parseInt(_this.$$('#noise-value').value, 10)
    }));
  };
  _this.$$('#noise-value').onchange = function() {
    applyFilterValue(8, 'noise', parseInt(this.value, 10));
  };
  _this.$$('#gradient-transparency').onclick = function () {
    applyFilter(9, this.checked && new f.GradientTransparency({
      threshold: parseInt(_this.$$('#gradient-transparency-value').value, 10)
    }));
  };
  _this.$$('#gradient-transparency-value').onchange = function() {
    applyFilterValue(9, 'threshold', parseInt(this.value, 10));
  };
  _this.$$('#pixelate').onclick = function() {
    applyFilter(10, this.checked && new f.Pixelate({
      blocksize: parseInt(_this.$$('#pixelate-value').value, 10)
    }));
  };
  _this.$$('#pixelate-value').onchange = function() {
    applyFilterValue(10, 'blocksize', parseInt(this.value, 10));
  };
  _this.$$('#blur').onclick = function() {
    applyFilter(11, this.checked && new f.Convolute({
      matrix: [ 1/9, 1/9, 1/9,
                1/9, 1/9, 1/9,
                1/9, 1/9, 1/9 ]
    }));
  };
  _this.$$('#sharpen').onclick = function() {
    applyFilter(12, this.checked && new f.Convolute({
      matrix: [  0, -1,  0,
                -1,  5, -1,
                 0, -1,  0 ]
    }));
  };
  _this.$$('#emboss').onclick = function() {
    applyFilter(13, this.checked && new f.Convolute({
      matrix: [ 1,   1,  1,
                1, 0.7, -1,
               -1,  -1, -1 ]
    }));
  };
  _this.$$('#tint').onclick = function() {
    applyFilter(14, this.checked && new f.Tint({
      color: _this.$$('#tint-color').value,
      opacity: parseFloat(_this.$$('#tint-opacity').value)
    }));
  };
  _this.$$('#tint-color').onchange = function() {
    applyFilterValue(14, 'color', this.value);
  };
  _this.$$('#tint-opacity').onchange = function() {
    applyFilterValue(14, 'opacity', parseFloat(this.value));
  };
  _this.$$('#multiply').onclick = function() {
    applyFilter(15, this.checked && new f.Multiply({
      color: _this.$$('#multiply-color').value
    }));
  };
  _this.$$('#multiply-color').onchange = function() {
    applyFilterValue(15, 'color', this.value);
  };

  _this.$$('#blend').onclick= function() {
    applyFilter(16, this.checked && new f.Blend({
      color: _this.$$('#blend-color').value,
      mode: _this.$$('#blend-mode').value
    }));
  };

  _this.$$('#blend-mode').onchange = function() {
    applyFilterValue(16, 'mode', this.value);
  };

  _this.$$('#blend-color').onchange = function() {
    applyFilterValue(16, 'color', this.value);
  };
}