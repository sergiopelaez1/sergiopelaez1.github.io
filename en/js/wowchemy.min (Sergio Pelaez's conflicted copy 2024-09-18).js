/*! Hugo Blox Builder v5.9.7 | https://hugoblox.com/ */
/*! Copyright 2016-present George Cushen (https://georgecushen.com/) */
/*! License: https://github.com/HugoBlox/hugo-blox-builder/blob/main/LICENSE.md */

;
(() => {
  // <stdin>
  (() => {
    var _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    var isSupported = function isSupported2(node) {
      return node.tagName === "IMG";
    };
    var isNodeList = function isNodeList2(selector) {
      return NodeList.prototype.isPrototypeOf(selector);
    };
    var isNode = function isNode2(selector) {
      return selector && selector.nodeType === 1;
    };
    var isSvg = function isSvg2(image) {
      var source = image.currentSrc || image.src;
      return source.substr(-4).toLowerCase() === ".svg";
    };
    var getImagesFromSelector = function getImagesFromSelector2(selector) {
      try {
        if (Array.isArray(selector)) {
          return selector.filter(isSupported);
        }
        if (isNodeList(selector)) {
          return [].slice.call(selector).filter(isSupported);
        }
        if (isNode(selector)) {
          return [selector].filter(isSupported);
        }
        if (typeof selector === "string") {
          return [].slice.call(document.querySelectorAll(selector)).filter(isSupported);
        }
        return [];
      } catch (err) {
        throw new TypeError("The provided selector is invalid.\nExpects a CSS selector, a Node element, a NodeList or an array.\nSee: https://github.com/francoischalifour/medium-zoom");
      }
    };
    var createOverlay = function createOverlay2(background) {
      var overlay = document.createElement("div");
      overlay.classList.add("medium-zoom-overlay");
      overlay.style.background = background;
      return overlay;
    };
    var cloneTarget = function cloneTarget2(template) {
      var _template$getBounding = template.getBoundingClientRect(), top = _template$getBounding.top, left = _template$getBounding.left, width = _template$getBounding.width, height = _template$getBounding.height;
      var clone = template.cloneNode();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
      clone.removeAttribute("id");
      clone.style.position = "absolute";
      clone.style.top = top + scrollTop + "px";
      clone.style.left = left + scrollLeft + "px";
      clone.style.width = width + "px";
      clone.style.height = height + "px";
      clone.style.transform = "";
      return clone;
    };
    var createCustomEvent = function createCustomEvent2(type, params) {
      var eventParams = _extends({
        bubbles: false,
        cancelable: false,
        detail: void 0
      }, params);
      if (typeof window.CustomEvent === "function") {
        return new CustomEvent(type, eventParams);
      }
      var customEvent = document.createEvent("CustomEvent");
      customEvent.initCustomEvent(type, eventParams.bubbles, eventParams.cancelable, eventParams.detail);
      return customEvent;
    };
    var mediumZoom = function mediumZoom2(selector) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var Promise2 = window.Promise || function Promise3(fn) {
        function noop() {
        }
        fn(noop, noop);
      };
      var _handleClick = function _handleClick2(event) {
        var target = event.target;
        if (target === overlay) {
          close();
          return;
        }
        if (images.indexOf(target) === -1) {
          return;
        }
        toggle({ target });
      };
      var _handleScroll = function _handleScroll2() {
        if (isAnimating || !active.original) {
          return;
        }
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (Math.abs(scrollTop - currentScroll) > zoomOptions.scrollOffset) {
          setTimeout(close, 150);
        }
      };
      var _handleKeyUp = function _handleKeyUp2(event) {
        var key = event.key || event.keyCode;
        if (key === "Escape" || key === "Esc" || key === 27) {
          close();
        }
      };
      var update = function update2() {
        var options2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var newOptions = options2;
        if (options2.background) {
          overlay.style.background = options2.background;
        }
        if (options2.container && options2.container instanceof Object) {
          newOptions.container = _extends({}, zoomOptions.container, options2.container);
        }
        if (options2.template) {
          var template = isNode(options2.template) ? options2.template : document.querySelector(options2.template);
          newOptions.template = template;
        }
        zoomOptions = _extends({}, zoomOptions, newOptions);
        images.forEach(function(image) {
          image.dispatchEvent(createCustomEvent("medium-zoom:update", {
            detail: { zoom }
          }));
        });
        return zoom;
      };
      var clone = function clone2() {
        var options2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return mediumZoom2(_extends({}, zoomOptions, options2));
      };
      var attach = function attach2() {
        for (var _len = arguments.length, selectors = Array(_len), _key = 0; _key < _len; _key++) {
          selectors[_key] = arguments[_key];
        }
        var newImages = selectors.reduce(function(imagesAccumulator, currentSelector) {
          return [].concat(imagesAccumulator, getImagesFromSelector(currentSelector));
        }, []);
        newImages.filter(function(newImage) {
          return images.indexOf(newImage) === -1;
        }).forEach(function(newImage) {
          images.push(newImage);
          newImage.classList.add("medium-zoom-image");
        });
        eventListeners.forEach(function(_ref) {
          var type = _ref.type, listener = _ref.listener, options2 = _ref.options;
          newImages.forEach(function(image) {
            image.addEventListener(type, listener, options2);
          });
        });
        return zoom;
      };
      var detach = function detach2() {
        for (var _len2 = arguments.length, selectors = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          selectors[_key2] = arguments[_key2];
        }
        if (active.zoomed) {
          close();
        }
        var imagesToDetach = selectors.length > 0 ? selectors.reduce(function(imagesAccumulator, currentSelector) {
          return [].concat(imagesAccumulator, getImagesFromSelector(currentSelector));
        }, []) : images;
        imagesToDetach.forEach(function(image) {
          image.classList.remove("medium-zoom-image");
          image.dispatchEvent(createCustomEvent("medium-zoom:detach", {
            detail: { zoom }
          }));
        });
        images = images.filter(function(image) {
          return imagesToDetach.indexOf(image) === -1;
        });
        return zoom;
      };
      var on = function on2(type, listener) {
        var options2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        images.forEach(function(image) {
          image.addEventListener("medium-zoom:" + type, listener, options2);
        });
        eventListeners.push({ type: "medium-zoom:" + type, listener, options: options2 });
        return zoom;
      };
      var off = function off2(type, listener) {
        var options2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        images.forEach(function(image) {
          image.removeEventListener("medium-zoom:" + type, listener, options2);
        });
        eventListeners = eventListeners.filter(function(eventListener) {
          return !(eventListener.type === "medium-zoom:" + type && eventListener.listener.toString() === listener.toString());
        });
        return zoom;
      };
      var open = function open2() {
        var _ref2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, target = _ref2.target;
        var _animate = function _animate2() {
          var container = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          };
          var viewportWidth = void 0;
          var viewportHeight = void 0;
          if (zoomOptions.container) {
            if (zoomOptions.container instanceof Object) {
              container = _extends({}, container, zoomOptions.container);
              viewportWidth = container.width - container.left - container.right - zoomOptions.margin * 2;
              viewportHeight = container.height - container.top - container.bottom - zoomOptions.margin * 2;
            } else {
              var zoomContainer = isNode(zoomOptions.container) ? zoomOptions.container : document.querySelector(zoomOptions.container);
              var _zoomContainer$getBou = zoomContainer.getBoundingClientRect(), _width = _zoomContainer$getBou.width, _height = _zoomContainer$getBou.height, _left = _zoomContainer$getBou.left, _top = _zoomContainer$getBou.top;
              container = _extends({}, container, {
                width: _width,
                height: _height,
                left: _left,
                top: _top
              });
            }
          }
          viewportWidth = viewportWidth || container.width - zoomOptions.margin * 2;
          viewportHeight = viewportHeight || container.height - zoomOptions.margin * 2;
          var zoomTarget = active.zoomedHd || active.original;
          var naturalWidth = isSvg(zoomTarget) ? viewportWidth : zoomTarget.naturalWidth || viewportWidth;
          var naturalHeight = isSvg(zoomTarget) ? viewportHeight : zoomTarget.naturalHeight || viewportHeight;
          var _zoomTarget$getBoundi = zoomTarget.getBoundingClientRect(), top = _zoomTarget$getBoundi.top, left = _zoomTarget$getBoundi.left, width = _zoomTarget$getBoundi.width, height = _zoomTarget$getBoundi.height;
          var scaleX = Math.min(Math.max(width, naturalWidth), viewportWidth) / width;
          var scaleY = Math.min(Math.max(height, naturalHeight), viewportHeight) / height;
          var scale = Math.min(scaleX, scaleY);
          var translateX = (-left + (viewportWidth - width) / 2 + zoomOptions.margin + container.left) / scale;
          var translateY = (-top + (viewportHeight - height) / 2 + zoomOptions.margin + container.top) / scale;
          var transform = "scale(" + scale + ") translate3d(" + translateX + "px, " + translateY + "px, 0)";
          active.zoomed.style.transform = transform;
          if (active.zoomedHd) {
            active.zoomedHd.style.transform = transform;
          }
        };
        return new Promise2(function(resolve) {
          if (target && images.indexOf(target) === -1) {
            resolve(zoom);
            return;
          }
          var _handleOpenEnd = function _handleOpenEnd2() {
            isAnimating = false;
            active.zoomed.removeEventListener("transitionend", _handleOpenEnd2);
            active.original.dispatchEvent(createCustomEvent("medium-zoom:opened", {
              detail: { zoom }
            }));
            resolve(zoom);
          };
          if (active.zoomed) {
            resolve(zoom);
            return;
          }
          if (target) {
            active.original = target;
          } else if (images.length > 0) {
            var _images = images;
            active.original = _images[0];
          } else {
            resolve(zoom);
            return;
          }
          active.original.dispatchEvent(createCustomEvent("medium-zoom:open", {
            detail: { zoom }
          }));
          scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          isAnimating = true;
          active.zoomed = cloneTarget(active.original);
          document.body.appendChild(overlay);
          if (zoomOptions.template) {
            var template = isNode(zoomOptions.template) ? zoomOptions.template : document.querySelector(zoomOptions.template);
            active.template = document.createElement("div");
            active.template.appendChild(template.content.cloneNode(true));
            document.body.appendChild(active.template);
          }
          if (active.original.parentElement && active.original.parentElement.tagName === "PICTURE" && active.original.currentSrc) {
            active.zoomed.src = active.original.currentSrc;
          }
          document.body.appendChild(active.zoomed);
          window.requestAnimationFrame(function() {
            document.body.classList.add("medium-zoom--opened");
          });
          active.original.classList.add("medium-zoom-image--hidden");
          active.zoomed.classList.add("medium-zoom-image--opened");
          active.zoomed.addEventListener("click", close);
          active.zoomed.addEventListener("transitionend", _handleOpenEnd);
          if (active.original.getAttribute("data-zoom-src")) {
            active.zoomedHd = active.zoomed.cloneNode();
            active.zoomedHd.removeAttribute("srcset");
            active.zoomedHd.removeAttribute("sizes");
            active.zoomedHd.removeAttribute("loading");
            active.zoomedHd.src = active.zoomed.getAttribute("data-zoom-src");
            active.zoomedHd.onerror = function() {
              clearInterval(getZoomTargetSize);
              console.warn("Unable to reach the zoom image target " + active.zoomedHd.src);
              active.zoomedHd = null;
              _animate();
            };
            var getZoomTargetSize = setInterval(function() {
              if (active.zoomedHd.complete) {
                clearInterval(getZoomTargetSize);
                active.zoomedHd.classList.add("medium-zoom-image--opened");
                active.zoomedHd.addEventListener("click", close);
                document.body.appendChild(active.zoomedHd);
                _animate();
              }
            }, 10);
          } else if (active.original.hasAttribute("srcset")) {
            active.zoomedHd = active.zoomed.cloneNode();
            active.zoomedHd.removeAttribute("sizes");
            active.zoomedHd.removeAttribute("loading");
            var loadEventListener = active.zoomedHd.addEventListener("load", function() {
              active.zoomedHd.removeEventListener("load", loadEventListener);
              active.zoomedHd.classList.add("medium-zoom-image--opened");
              active.zoomedHd.addEventListener("click", close);
              document.body.appendChild(active.zoomedHd);
              _animate();
            });
          } else {
            _animate();
          }
        });
      };
      var close = function close2() {
        return new Promise2(function(resolve) {
          if (isAnimating || !active.original) {
            resolve(zoom);
            return;
          }
          var _handleCloseEnd = function _handleCloseEnd2() {
            active.original.classList.remove("medium-zoom-image--hidden");
            document.body.removeChild(active.zoomed);
            if (active.zoomedHd) {
              document.body.removeChild(active.zoomedHd);
            }
            document.body.removeChild(overlay);
            active.zoomed.classList.remove("medium-zoom-image--opened");
            if (active.template) {
              document.body.removeChild(active.template);
            }
            isAnimating = false;
            active.zoomed.removeEventListener("transitionend", _handleCloseEnd2);
            active.original.dispatchEvent(createCustomEvent("medium-zoom:closed", {
              detail: { zoom }
            }));
            active.original = null;
            active.zoomed = null;
            active.zoomedHd = null;
            active.template = null;
            resolve(zoom);
          };
          isAnimating = true;
          document.body.classList.remove("medium-zoom--opened");
          active.zoomed.style.transform = "";
          if (active.zoomedHd) {
            active.zoomedHd.style.transform = "";
          }
          if (active.template) {
            active.template.style.transition = "opacity 150ms";
            active.template.style.opacity = 0;
          }
          active.original.dispatchEvent(createCustomEvent("medium-zoom:close", {
            detail: { zoom }
          }));
          active.zoomed.addEventListener("transitionend", _handleCloseEnd);
        });
      };
      var toggle = function toggle2() {
        var _ref3 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, target = _ref3.target;
        if (active.original) {
          return close();
        }
        return open({ target });
      };
      var getOptions = function getOptions2() {
        return zoomOptions;
      };
      var getImages = function getImages2() {
        return images;
      };
      var getZoomedImage = function getZoomedImage2() {
        return active.original;
      };
      var images = [];
      var eventListeners = [];
      var isAnimating = false;
      var scrollTop = 0;
      var zoomOptions = options;
      var active = {
        original: null,
        zoomed: null,
        zoomedHd: null,
        template: null
        // If the selector is omitted, it's replaced by the options
      };
      if (Object.prototype.toString.call(selector) === "[object Object]") {
        zoomOptions = selector;
      } else if (selector || typeof selector === "string") {
        attach(selector);
      }
      zoomOptions = _extends({
        margin: 0,
        background: "#fff",
        scrollOffset: 40,
        container: null,
        template: null
      }, zoomOptions);
      var overlay = createOverlay(zoomOptions.background);
      document.addEventListener("click", _handleClick);
      document.addEventListener("keyup", _handleKeyUp);
      document.addEventListener("scroll", _handleScroll);
      window.addEventListener("resize", close);
      var zoom = {
        open,
        close,
        toggle,
        update,
        clone,
        attach,
        detach,
        on,
        off,
        getOptions,
        getImages,
        getZoomedImage
      };
      return zoom;
    };
    function styleInject(css2, ref) {
      if (ref === void 0)
        ref = {};
      var insertAt = ref.insertAt;
      if (!css2 || typeof document === "undefined") {
        return;
      }
      var head = document.head || document.getElementsByTagName("head")[0];
      var style = document.createElement("style");
      style.type = "text/css";
      if (insertAt === "top") {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }
      if (style.styleSheet) {
        style.styleSheet.cssText = css2;
      } else {
        style.appendChild(document.createTextNode(css2));
      }
    }
    var css = ".medium-zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity .3s;will-change:opacity}.medium-zoom--opened .medium-zoom-overlay{cursor:pointer;cursor:zoom-out;opacity:1}.medium-zoom-image{cursor:pointer;cursor:zoom-in;transition:transform .3s cubic-bezier(.2,0,.2,1)!important}.medium-zoom-image--hidden{visibility:hidden}.medium-zoom-image--opened{position:relative;cursor:pointer;cursor:zoom-out;will-change:transform}";
    styleInject(css);
    var medium_zoom_esm_default = mediumZoom;
    var hugoEnvironment = "development";
    var i18n = { copied: "Copied", copy: "Copy" };
    var searchEnabled = true;
    function scrollParentToChild(parent, child) {
      const parentRect = parent.getBoundingClientRect();
      const parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth
      };
      const childRect = child.getBoundingClientRect();
      const isChildInView = childRect.top >= parentRect.top && childRect.bottom <= parentRect.top + parentViewableArea.height;
      if (!isChildInView) {
        parent.scrollTop = childRect.top + parent.scrollTop - parentRect.top;
      }
    }
    function getNavBarHeight() {
      let navbar = document.getElementById("navbar-main");
      let navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      console.debug("Navbar height: " + navbarHeight);
      return navbarHeight;
    }
    function scrollToAnchor(target, duration = 0) {
      target = typeof target === "undefined" || typeof target === "object" ? decodeURIComponent(window.location.hash) : target;
      if ($(target).length) {
        target = "#" + $.escapeSelector(target.substring(1));
        let elementOffset = Math.ceil($(target).offset().top - getNavBarHeight());
        document.querySelector("body").classList.add("scrolling");
        $("html, body").animate(
          {
            scrollTop: elementOffset
          },
          duration,
          function() {
            document.querySelector("body").classList.remove("scrolling");
          }
        );
      } else {
        console.debug("Cannot scroll to target `#" + target + "`. ID not found!");
      }
    }
    function fixScrollspy() {
      let $body = $("body");
      let data = $body.data("bs.scrollspy");
      if (data) {
        data._config.offset = getNavBarHeight();
        $body.data("bs.scrollspy", data);
        $body.scrollspy("refresh");
      }
    }
    $("#navbar-main li.nav-item a.nav-link, .js-scroll").on("click", function(event) {
      let hash = this.hash;
      if (this.pathname === window.location.pathname && hash && $(hash).length && $(".js-widget-page").length > 0) {
        event.preventDefault();
        let elementOffset = Math.ceil($(hash).offset().top - getNavBarHeight());
        $("html, body").animate(
          {
            scrollTop: elementOffset
          },
          800
        );
      }
    });
    $(document).on("click", ".navbar-collapse.show", function(e) {
      let targetElement = $(e.target).is("a") ? $(e.target) : $(e.target).parent();
      if (targetElement.is("a") && targetElement.attr("class") != "dropdown-toggle") {
        $(this).collapse("hide");
      }
    });
    $("body").on("mouseenter mouseleave", ".dropdown", function(e) {
      var dropdown = $(e.target).closest(".dropdown");
      var menu = $(".dropdown-menu", dropdown);
      dropdown.addClass("show");
      menu.addClass("show");
      setTimeout(function() {
        dropdown[dropdown.is(":hover") ? "addClass" : "removeClass"]("show");
        menu[dropdown.is(":hover") ? "addClass" : "removeClass"]("show");
      }, 300);
    });
    var resizeTimer;
    $(window).resize(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fixScrollspy, 200);
    });
    window.addEventListener("hashchange", scrollToAnchor);
    function printLatestRelease(selector, repo) {
      if (hugoEnvironment === "production") {
        $.getJSON("https://api.github.com/repos/" + repo + "/tags").done(function(json) {
          let release = json[0];
          $(selector).append(" " + release.name);
        }).fail(function(jqxhr, textStatus, error) {
          let err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });
      }
    }
    function fadeIn(element, duration = 600) {
      element.style.display = "";
      element.style.opacity = "0";
      let last = +/* @__PURE__ */ new Date();
      let tick = function() {
        element.style.opacity = (+element.style.opacity + (/* @__PURE__ */ new Date() - last) / duration).toString();
        last = +/* @__PURE__ */ new Date();
        if (+element.style.opacity < 1) {
          window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
        }
      };
      tick();
    }
    var body = document.body;
    function getThemeMode() {
      return parseInt(localStorage.getItem("wcTheme") || 2);
    }
    function canChangeTheme() {
      return Boolean(window.wc.darkLightEnabled);
    }
    function initThemeVariation() {
      if (!canChangeTheme()) {
        console.debug("User theming disabled.");
        return {
          isDarkTheme: window.wc.isSiteThemeDark,
          themeMode: window.wc.isSiteThemeDark ? 1 : 0
        };
      }
      console.debug("User theming enabled.");
      let isDarkTheme;
      let currentThemeMode = getThemeMode();
      console.debug(`User's theme variation: ${currentThemeMode}`);
      switch (currentThemeMode) {
        case 0:
          isDarkTheme = false;
          break;
        case 1:
          isDarkTheme = true;
          break;
        default:
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            isDarkTheme = true;
          } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            isDarkTheme = false;
          } else {
            isDarkTheme = window.wc.isSiteThemeDark;
          }
          break;
      }
      if (isDarkTheme && !body.classList.contains("dark")) {
        console.debug("Applying Hugo Blox Builder dark theme");
        document.body.classList.add("dark");
      } else if (!isDarkTheme && body.classList.contains("dark")) {
        console.debug("Applying Hugo Blox Builder light theme");
        document.body.classList.remove("dark");
      }
      return {
        isDarkTheme,
        themeMode: currentThemeMode
      };
    }
    function changeThemeModeClick(newMode) {
      if (!canChangeTheme()) {
        console.debug("Cannot change theme - user theming disabled.");
        return;
      }
      let isDarkTheme;
      switch (newMode) {
        case 0:
          localStorage.setItem("wcTheme", "0");
          isDarkTheme = false;
          console.debug("User changed theme variation to Light.");
          break;
        case 1:
          localStorage.setItem("wcTheme", "1");
          isDarkTheme = true;
          console.debug("User changed theme variation to Dark.");
          break;
        default:
          localStorage.setItem("wcTheme", "2");
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            isDarkTheme = true;
          } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            isDarkTheme = false;
          } else {
            isDarkTheme = window.wc.isSiteThemeDark;
          }
          console.debug("User changed theme variation to Auto.");
          break;
      }
      renderThemeVariation(isDarkTheme, newMode);
    }
    function showActiveTheme(mode) {
      let linkLight2 = document.querySelector(".js-set-theme-light");
      let linkDark2 = document.querySelector(".js-set-theme-dark");
      let linkAuto2 = document.querySelector(".js-set-theme-auto");
      if (linkLight2 === null) {
        return;
      }
      switch (mode) {
        case 0:
          linkLight2.classList.add("dropdown-item-active");
          linkDark2.classList.remove("dropdown-item-active");
          linkAuto2.classList.remove("dropdown-item-active");
          break;
        case 1:
          linkLight2.classList.remove("dropdown-item-active");
          linkDark2.classList.add("dropdown-item-active");
          linkAuto2.classList.remove("dropdown-item-active");
          break;
        default:
          linkLight2.classList.remove("dropdown-item-active");
          linkDark2.classList.remove("dropdown-item-active");
          linkAuto2.classList.add("dropdown-item-active");
          break;
      }
    }
    function renderThemeVariation(isDarkTheme, themeMode = 2, init = false) {
      const codeHlLight = document.querySelector("link[title=hl-light]");
      const codeHlDark = document.querySelector("link[title=hl-dark]");
      const codeHlEnabled = codeHlLight !== null || codeHlDark !== null;
      const diagramEnabled = document.querySelector("script[title=mermaid]") !== null;
      showActiveTheme(themeMode);
      const themeChangeEvent = new CustomEvent("wcThemeChange", { detail: { isDarkTheme: () => isDarkTheme } });
      document.dispatchEvent(themeChangeEvent);
      if (!init) {
        if (isDarkTheme === false && !body.classList.contains("dark") || isDarkTheme === true && body.classList.contains("dark")) {
          return;
        }
      }
      if (isDarkTheme === false) {
        if (!init) {
          Object.assign(document.body.style, { opacity: 0, visibility: "visible" });
          fadeIn(document.body, 600);
        }
        body.classList.remove("dark");
        if (codeHlEnabled) {
          console.debug("Setting HLJS theme to light");
          if (codeHlLight) {
            codeHlLight.disabled = false;
          }
          if (codeHlDark) {
            codeHlDark.disabled = true;
          }
        }
        if (diagramEnabled) {
          console.debug("Initializing Mermaid with light theme");
          if (init) {
            window.mermaid.initialize({ startOnLoad: true, theme: "default", securityLevel: "loose" });
          } else {
            location.reload();
          }
        }
      } else if (isDarkTheme === true) {
        if (!init) {
          Object.assign(document.body.style, { opacity: 0, visibility: "visible" });
          fadeIn(document.body, 600);
        }
        body.classList.add("dark");
        if (codeHlEnabled) {
          console.debug("Setting HLJS theme to dark");
          if (codeHlLight) {
            codeHlLight.disabled = true;
          }
          if (codeHlDark) {
            codeHlDark.disabled = false;
          }
        }
        if (diagramEnabled) {
          console.debug("Initializing Mermaid with dark theme");
          if (init) {
            window.mermaid.initialize({ startOnLoad: true, theme: "dark", securityLevel: "loose" });
          } else {
            location.reload();
          }
        }
      }
    }
    function onMediaQueryListEvent(event) {
      if (!canChangeTheme()) {
        return;
      }
      const darkModeOn = event.matches;
      console.debug(`OS dark mode preference changed to ${darkModeOn ? "\u{1F312} on" : "\u2600\uFE0F off"}.`);
      let currentThemeVariation = getThemeMode();
      let isDarkTheme;
      if (currentThemeVariation === 2) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          isDarkTheme = true;
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          isDarkTheme = false;
        } else {
          isDarkTheme = window.wc.isSiteThemeDark;
        }
        renderThemeVariation(isDarkTheme, currentThemeVariation);
      }
    }
    console.debug(`Environment: ${hugoEnvironment}`);
    function removeQueryParamsFromUrl() {
      if (window.history.replaceState) {
        let urlWithoutSearchParams = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
        window.history.replaceState({ path: urlWithoutSearchParams }, "", urlWithoutSearchParams);
      }
    }
    function toggleSearchDialog() {
      const body2 = document.querySelector("body");
      if (body2.classList.contains("searching")) {
        document.getElementById("search-query").blur();
        body2.classList.remove("searching", "compensate-for-scrollbar");
        removeQueryParamsFromUrl();
        $("#fancybox-style-noscroll").remove();
      } else {
        if (!$("#fancybox-style-noscroll").length && document.body.scrollHeight > window.innerHeight) {
          $("head").append(
            '<style id="fancybox-style-noscroll">.compensate-for-scrollbar{margin-right:' + (window.innerWidth - document.documentElement.clientWidth) + "px;}</style>"
          );
          body2.classList.add("compensate-for-scrollbar");
        }
        body2.classList.add("searching");
        $(".search-results").css({ opacity: 0, visibility: "visible" }).animate({ opacity: 1 }, 200);
        let algoliaSearchBox = document.querySelector(".ais-SearchBox-input");
        if (algoliaSearchBox) {
          algoliaSearchBox.focus();
        } else {
          document.getElementById("search-query").focus();
        }
      }
    }
    function fixHugoOutput() {
      if (document.querySelector("#TableOfContents")) {
        document.querySelector("#TableOfContents").classList.add("nav", "flex-column");
      }
      document.querySelectorAll("#TableOfContents li").forEach((item) => {
        item.classList.add("nav-item");
      });
      document.querySelectorAll("#TableOfContents li a").forEach((link) => {
        link.classList.add("nav-link");
      });
      document.querySelectorAll("input[type='checkbox'][disabled]").forEach((checkbox) => {
        checkbox.closest("ul").classList.add("task-list");
      });
      document.querySelectorAll("table").forEach((table) => {
        table.classList.add("table");
      });
    }
    function getSiblings(elem) {
      return Array.prototype.filter.call(elem.parentNode.children, function(sibling) {
        return sibling !== elem;
      });
    }
    document.addEventListener("DOMContentLoaded", function() {
      fixHugoOutput();
      let { isDarkTheme, themeMode } = initThemeVariation();
      renderThemeVariation(isDarkTheme, themeMode, true);
      let child = document.querySelector(".docs-links .active");
      let parent = document.querySelector(".docs-links");
      if (child && parent) {
        scrollParentToChild(parent, child);
      }
      let githubReleaseSelector = ".js-github-release";
      if ($(githubReleaseSelector).length > 0) {
        printLatestRelease(githubReleaseSelector, $(githubReleaseSelector).data("repo"));
      }
    });
    window.addEventListener("load", function() {
      fixScrollspy();
      let isotopeInstances = document.querySelectorAll(".projects-container");
      let isotopeInstancesCount = isotopeInstances.length;
      if (window.location.hash && isotopeInstancesCount === 0) {
        scrollToAnchor(decodeURIComponent(window.location.hash), 0);
      }
      let child = document.querySelector(".docs-toc .nav-link.active");
      let parent = document.querySelector(".docs-toc");
      if (child && parent) {
        scrollParentToChild(parent, child);
      }
      let zoomOptions = {};
      if (document.body.classList.contains("dark")) {
        zoomOptions.background = "rgba(0,0,0,0.9)";
      } else {
        zoomOptions.background = "rgba(255,255,255,0.9)";
      }
      medium_zoom_esm_default("[data-zoomable]", zoomOptions);
      let isotopeCounter = 0;
      isotopeInstances.forEach(function(isotopeInstance, index) {
        console.debug(`Loading Isotope instance ${index}`);
        let iso;
        let isoSection = isotopeInstance.closest("section");
        let layout = "";
        if (isoSection.querySelector(".isotope").classList.contains("js-layout-row")) {
          layout = "fitRows";
        } else {
          layout = "masonry";
        }
        let defaultFilter = isoSection.querySelector(".default-project-filter");
        let filterText = "*";
        if (defaultFilter !== null) {
          filterText = defaultFilter.textContent;
        }
        console.debug(`Default Isotope filter: ${filterText}`);
        imagesLoaded(isotopeInstance, function() {
          iso = new Isotope(isotopeInstance, {
            itemSelector: ".isotope-item",
            layoutMode: layout,
            masonry: {
              gutter: 20
            },
            filter: filterText
          });
          let isoFilterButtons = isoSection.querySelectorAll(".project-filters a");
          isoFilterButtons.forEach(
            (button) => button.addEventListener("click", (e) => {
              e.preventDefault();
              let selector = button.getAttribute("data-filter");
              console.debug(`Updating Isotope filter to ${selector}`);
              iso.arrange({ filter: selector });
              button.classList.remove("active");
              button.classList.add("active");
              let buttonSiblings = getSiblings(button);
              buttonSiblings.forEach((buttonSibling) => {
                buttonSibling.classList.remove("active");
                buttonSibling.classList.remove("all");
              });
            })
          );
          incrementIsotopeCounter();
        });
      });
      function incrementIsotopeCounter() {
        isotopeCounter++;
        if (isotopeCounter === isotopeInstancesCount) {
          console.debug(`All Portfolio Isotope instances loaded.`);
          if (window.location.hash) {
            scrollToAnchor(decodeURIComponent(window.location.hash), 0);
          }
        }
      }
      document.addEventListener("keyup", (event) => {
        if (event.code === "Escape") {
          const body2 = document.body;
          if (body2.classList.contains("searching")) {
            toggleSearchDialog();
          }
        }
        if (event.key === "/") {
          let focusedElement = document.hasFocus() && document.activeElement !== document.body && document.activeElement !== document.documentElement && document.activeElement || null;
          let isInputFocused = focusedElement instanceof HTMLInputElement || focusedElement instanceof HTMLTextAreaElement;
          if (searchEnabled && !isInputFocused) {
            event.preventDefault();
            toggleSearchDialog();
          }
        }
      });
      if (searchEnabled) {
        document.querySelectorAll(".js-search").forEach((element) => {
          element.addEventListener("click", (e) => {
            e.preventDefault();
            toggleSearchDialog();
          });
        });
      }
      $('[data-toggle="tooltip"]').tooltip();
    });
    var linkLight = document.querySelector(".js-set-theme-light");
    var linkDark = document.querySelector(".js-set-theme-dark");
    var linkAuto = document.querySelector(".js-set-theme-auto");
    if (linkLight && linkDark && linkAuto) {
      linkLight.addEventListener("click", (event) => {
        event.preventDefault();
        changeThemeModeClick(0);
      });
      linkDark.addEventListener("click", (event) => {
        event.preventDefault();
        changeThemeModeClick(1);
      });
      linkAuto.addEventListener("click", (event) => {
        event.preventDefault();
        changeThemeModeClick(2);
      });
    }
    var darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeMediaQuery.addEventListener("change", (event) => {
      onMediaQueryListEvent(event);
    });
    document.querySelectorAll("pre > code").forEach((codeblock) => {
      const container = codeblock.parentNode.parentNode;
      const copyBtn = document.createElement("button");
      let classesToAdd = ["btn", "btn-primary", "btn-copy-code"];
      copyBtn.classList.add(...classesToAdd);
      copyBtn.innerHTML = i18n["copy"];
      function copiedNotification() {
        copyBtn.innerHTML = i18n["copied"];
        setTimeout(() => {
          copyBtn.innerHTML = i18n["copy"];
        }, 2e3);
      }
      copyBtn.addEventListener("click", () => {
        console.debug("Code block copy click. Is secure context for Clipboard API? " + window.isSecureContext);
        if ("clipboard" in navigator) {
          navigator.clipboard.writeText(codeblock.textContent);
          copiedNotification();
          return;
        } else {
          console.debug("Falling back to legacy clipboard copy");
          const range = document.createRange();
          range.selectNodeContents(codeblock);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          try {
            document.execCommand("copy");
            copiedNotification();
          } catch (e) {
            console.error(e);
          }
          selection.removeRange(range);
        }
      });
      if (container.classList.contains("highlight")) {
        container.appendChild(copyBtn);
      } else if (codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "TABLE") {
        codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(copyBtn);
      } else {
        codeblock.parentNode.appendChild(copyBtn);
      }
    });
  })();
  (() => {
    var content_type = { authors: "Authors", event: "Events", post: "Posts", project: "Projects", publication: "Publications", slides: "Slides" };
    var i18n = { no_results: "No results found", placeholder: "Search...", results: "results found" };
    var search_config = { indexURI: "/index.json", minLength: 1, threshold: 0.3 };
    var fuseOptions = {
      shouldSort: true,
      includeMatches: true,
      tokenize: true,
      threshold: search_config.threshold,
      // Set to ~0.3 for parsing diacritics and CJK languages.
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: search_config.minLength,
      // Set to 1 for parsing CJK languages.
      keys: [
        { name: "title", weight: 0.99 },
        { name: "summary", weight: 0.6 },
        { name: "authors", weight: 0.5 },
        { name: "content", weight: 0.2 },
        { name: "tags", weight: 0.5 },
        { name: "categories", weight: 0.5 }
      ]
    };
    var summaryLength = 60;
    function getSearchQuery(name) {
      return decodeURIComponent((location.search.split(name + "=")[1] || "").split("&")[0]).replace(/\+/g, " ");
    }
    function updateURL(url) {
      if (history.replaceState) {
        window.history.replaceState({ path: url }, "", url);
      }
    }
    function initSearch(force, fuse) {
      let query = $("#search-query").val();
      if (query.length < 1) {
        $("#search-hits").empty();
        $("#search-common-queries").show();
      }
      if (!force && query.length < fuseOptions.minMatchCharLength)
        return;
      $("#search-hits").empty();
      $("#search-common-queries").hide();
      searchAcademic(query, fuse);
      let newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + "?q=" + encodeURIComponent(query) + window.location.hash;
      updateURL(newURL);
    }
    function searchAcademic(query, fuse) {
      let results = fuse.search(query);
      if (results.length > 0) {
        $("#search-hits").append('<h3 class="mt-0">' + results.length + " " + i18n.results + "</h3>");
        parseResults(query, results);
      } else {
        $("#search-hits").append('<div class="search-no-results">' + i18n.no_results + "</div>");
      }
    }
    function parseResults(query, results) {
      $.each(results, function(key, value) {
        let content_key = value.item.section;
        let content = "";
        let snippet = "";
        let snippetHighlights = [];
        if (["publication", "event"].includes(content_key)) {
          content = value.item.summary;
        } else {
          content = value.item.content;
        }
        if (fuseOptions.tokenize) {
          snippetHighlights.push(query);
        } else {
          $.each(value.matches, function(matchKey, matchValue) {
            if (matchValue.key == "content") {
              let start = matchValue.indices[0][0] - summaryLength > 0 ? matchValue.indices[0][0] - summaryLength : 0;
              let end = matchValue.indices[0][1] + summaryLength < content.length ? matchValue.indices[0][1] + summaryLength : content.length;
              snippet += content.substring(start, end);
              snippetHighlights.push(
                matchValue.value.substring(
                  matchValue.indices[0][0],
                  matchValue.indices[0][1] - matchValue.indices[0][0] + 1
                )
              );
            }
          });
        }
        if (snippet.length < 1) {
          snippet += value.item.summary;
        }
        let template = $("#search-hit-fuse-template").html();
        if (content_key in content_type) {
          content_key = content_type[content_key];
        }
        let templateData = {
          key,
          title: value.item.title,
          type: content_key,
          relpermalink: value.item.relpermalink,
          snippet
        };
        let output = render(template, templateData);
        $("#search-hits").append(output);
        $.each(snippetHighlights, function(hlKey, hlValue) {
          $("#summary-" + key).mark(hlValue);
        });
      });
    }
    function render(template, data) {
      let key, find, re;
      for (key in data) {
        find = "\\{\\{\\s*" + key + "\\s*\\}\\}";
        re = new RegExp(find, "g");
        template = template.replace(re, data[key]);
      }
      return template;
    }
    if (typeof Fuse === "function") {
      $.getJSON(search_config.indexURI, function(search_index) {
        let fuse = new Fuse(search_index, fuseOptions);
        let query = getSearchQuery("q");
        if (query) {
          document.querySelector("body").classList.add("searching");
          $(".search-results").css({ opacity: 0, visibility: "visible" }).animate({ opacity: 1 }, 200);
          $("#search-query").val(query);
          $("#search-query").focus();
          initSearch(true, fuse);
        }
        $("#search-query").keyup(function(e) {
          clearTimeout($.data(this, "searchTimer"));
          if (e.keyCode == 13) {
            initSearch(true, fuse);
          } else {
            $(this).data(
              "searchTimer",
              setTimeout(function() {
                initSearch(false, fuse);
              }, 250)
            );
          }
        });
      });
    }
  })();
})();
/*! medium-zoom 1.0.8 | MIT License | https://github.com/francoischalifour/medium-zoom */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiPHN0ZGluPiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiKCgpID0+IHtcbiAgLy8gbnMtaHVnbzpDOlxcVXNlcnNcXHNwZWxhZXozXFxHYVRlY2ggRHJvcGJveFxcU2VyZ2lvIFBlbGFlelxcSm9iIEFwcGxpY2F0aW9uXFxBY2FkZW1pY1xcd2Vic2l0ZVxcdGhlbWVzXFxnaXRodWIuY29tXFxIdWdvQmxveFxcaHVnby1ibG94LWJ1aWxkZXJcXG1vZHVsZXNcXGJsb3gtYm9vdHN0cmFwXFx2NVxcYXNzZXRzXFxqc1xcX3ZlbmRvclxcbWVkaXVtLXpvb20uZXNtLmpzXG4gIHZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuICB2YXIgaXNTdXBwb3J0ZWQgPSBmdW5jdGlvbiBpc1N1cHBvcnRlZDIobm9kZSkge1xuICAgIHJldHVybiBub2RlLnRhZ05hbWUgPT09IFwiSU1HXCI7XG4gIH07XG4gIHZhciBpc05vZGVMaXN0ID0gZnVuY3Rpb24gaXNOb2RlTGlzdDIoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gTm9kZUxpc3QucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yoc2VsZWN0b3IpO1xuICB9O1xuICB2YXIgaXNOb2RlID0gZnVuY3Rpb24gaXNOb2RlMihzZWxlY3Rvcikge1xuICAgIHJldHVybiBzZWxlY3RvciAmJiBzZWxlY3Rvci5ub2RlVHlwZSA9PT0gMTtcbiAgfTtcbiAgdmFyIGlzU3ZnID0gZnVuY3Rpb24gaXNTdmcyKGltYWdlKSB7XG4gICAgdmFyIHNvdXJjZSA9IGltYWdlLmN1cnJlbnRTcmMgfHwgaW1hZ2Uuc3JjO1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic3RyKC00KS50b0xvd2VyQ2FzZSgpID09PSBcIi5zdmdcIjtcbiAgfTtcbiAgdmFyIGdldEltYWdlc0Zyb21TZWxlY3RvciA9IGZ1bmN0aW9uIGdldEltYWdlc0Zyb21TZWxlY3RvcjIoc2VsZWN0b3IpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5maWx0ZXIoaXNTdXBwb3J0ZWQpO1xuICAgICAgfVxuICAgICAgaWYgKGlzTm9kZUxpc3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKHNlbGVjdG9yKS5maWx0ZXIoaXNTdXBwb3J0ZWQpO1xuICAgICAgfVxuICAgICAgaWYgKGlzTm9kZShzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIFtzZWxlY3Rvcl0uZmlsdGVyKGlzU3VwcG9ydGVkKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpLmZpbHRlcihpc1N1cHBvcnRlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIHByb3ZpZGVkIHNlbGVjdG9yIGlzIGludmFsaWQuXFxuRXhwZWN0cyBhIENTUyBzZWxlY3RvciwgYSBOb2RlIGVsZW1lbnQsIGEgTm9kZUxpc3Qgb3IgYW4gYXJyYXkuXFxuU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZnJhbmNvaXNjaGFsaWZvdXIvbWVkaXVtLXpvb21cIik7XG4gICAgfVxuICB9O1xuICB2YXIgY3JlYXRlT3ZlcmxheSA9IGZ1bmN0aW9uIGNyZWF0ZU92ZXJsYXkyKGJhY2tncm91bmQpIHtcbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKFwibWVkaXVtLXpvb20tb3ZlcmxheVwiKTtcbiAgICBvdmVybGF5LnN0eWxlLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xuICAgIHJldHVybiBvdmVybGF5O1xuICB9O1xuICB2YXIgY2xvbmVUYXJnZXQgPSBmdW5jdGlvbiBjbG9uZVRhcmdldDIodGVtcGxhdGUpIHtcbiAgICB2YXIgX3RlbXBsYXRlJGdldEJvdW5kaW5nID0gdGVtcGxhdGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIHRvcCA9IF90ZW1wbGF0ZSRnZXRCb3VuZGluZy50b3AsIGxlZnQgPSBfdGVtcGxhdGUkZ2V0Qm91bmRpbmcubGVmdCwgd2lkdGggPSBfdGVtcGxhdGUkZ2V0Qm91bmRpbmcud2lkdGgsIGhlaWdodCA9IF90ZW1wbGF0ZSRnZXRCb3VuZGluZy5oZWlnaHQ7XG4gICAgdmFyIGNsb25lID0gdGVtcGxhdGUuY2xvbmVOb2RlKCk7XG4gICAgdmFyIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IDA7XG4gICAgdmFyIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0IHx8IDA7XG4gICAgY2xvbmUucmVtb3ZlQXR0cmlidXRlKFwiaWRcIik7XG4gICAgY2xvbmUuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgY2xvbmUuc3R5bGUudG9wID0gdG9wICsgc2Nyb2xsVG9wICsgXCJweFwiO1xuICAgIGNsb25lLnN0eWxlLmxlZnQgPSBsZWZ0ICsgc2Nyb2xsTGVmdCArIFwicHhcIjtcbiAgICBjbG9uZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuICAgIGNsb25lLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcbiAgICBjbG9uZS5zdHlsZS50cmFuc2Zvcm0gPSBcIlwiO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfTtcbiAgdmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gZnVuY3Rpb24gY3JlYXRlQ3VzdG9tRXZlbnQyKHR5cGUsIHBhcmFtcykge1xuICAgIHZhciBldmVudFBhcmFtcyA9IF9leHRlbmRzKHtcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICBkZXRhaWw6IHZvaWQgMFxuICAgIH0sIHBhcmFtcyk7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIG5ldyBDdXN0b21FdmVudCh0eXBlLCBldmVudFBhcmFtcyk7XG4gICAgfVxuICAgIHZhciBjdXN0b21FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XG4gICAgY3VzdG9tRXZlbnQuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGV2ZW50UGFyYW1zLmJ1YmJsZXMsIGV2ZW50UGFyYW1zLmNhbmNlbGFibGUsIGV2ZW50UGFyYW1zLmRldGFpbCk7XG4gICAgcmV0dXJuIGN1c3RvbUV2ZW50O1xuICB9O1xuICB2YXIgbWVkaXVtWm9vbSA9IGZ1bmN0aW9uIG1lZGl1bVpvb20yKHNlbGVjdG9yKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHZvaWQgMCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIHZhciBQcm9taXNlMiA9IHdpbmRvdy5Qcm9taXNlIHx8IGZ1bmN0aW9uIFByb21pc2UzKGZuKSB7XG4gICAgICBmdW5jdGlvbiBub29wKCkge1xuICAgICAgfVxuICAgICAgZm4obm9vcCwgbm9vcCk7XG4gICAgfTtcbiAgICB2YXIgX2hhbmRsZUNsaWNrID0gZnVuY3Rpb24gX2hhbmRsZUNsaWNrMihldmVudCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGlmICh0YXJnZXQgPT09IG92ZXJsYXkpIHtcbiAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGltYWdlcy5pbmRleE9mKHRhcmdldCkgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRvZ2dsZSh7IHRhcmdldCB9KTtcbiAgICB9O1xuICAgIHZhciBfaGFuZGxlU2Nyb2xsID0gZnVuY3Rpb24gX2hhbmRsZVNjcm9sbDIoKSB7XG4gICAgICBpZiAoaXNBbmltYXRpbmcgfHwgIWFjdGl2ZS5vcmlnaW5hbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgY3VycmVudFNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IDA7XG4gICAgICBpZiAoTWF0aC5hYnMoc2Nyb2xsVG9wIC0gY3VycmVudFNjcm9sbCkgPiB6b29tT3B0aW9ucy5zY3JvbGxPZmZzZXQpIHtcbiAgICAgICAgc2V0VGltZW91dChjbG9zZSwgMTUwKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfaGFuZGxlS2V5VXAgPSBmdW5jdGlvbiBfaGFuZGxlS2V5VXAyKGV2ZW50KSB7XG4gICAgICB2YXIga2V5ID0gZXZlbnQua2V5IHx8IGV2ZW50LmtleUNvZGU7XG4gICAgICBpZiAoa2V5ID09PSBcIkVzY2FwZVwiIHx8IGtleSA9PT0gXCJFc2NcIiB8fCBrZXkgPT09IDI3KSB7XG4gICAgICAgIGNsb3NlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlMigpIHtcbiAgICAgIHZhciBvcHRpb25zMiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdm9pZCAwID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgICB2YXIgbmV3T3B0aW9ucyA9IG9wdGlvbnMyO1xuICAgICAgaWYgKG9wdGlvbnMyLmJhY2tncm91bmQpIHtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kID0gb3B0aW9uczIuYmFja2dyb3VuZDtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zMi5jb250YWluZXIgJiYgb3B0aW9uczIuY29udGFpbmVyIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIG5ld09wdGlvbnMuY29udGFpbmVyID0gX2V4dGVuZHMoe30sIHpvb21PcHRpb25zLmNvbnRhaW5lciwgb3B0aW9uczIuY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zMi50ZW1wbGF0ZSkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBpc05vZGUob3B0aW9uczIudGVtcGxhdGUpID8gb3B0aW9uczIudGVtcGxhdGUgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMyLnRlbXBsYXRlKTtcbiAgICAgICAgbmV3T3B0aW9ucy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgfVxuICAgICAgem9vbU9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgem9vbU9wdGlvbnMsIG5ld09wdGlvbnMpO1xuICAgICAgaW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgaW1hZ2UuZGlzcGF0Y2hFdmVudChjcmVhdGVDdXN0b21FdmVudChcIm1lZGl1bS16b29tOnVwZGF0ZVwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IHpvb20gfVxuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB6b29tO1xuICAgIH07XG4gICAgdmFyIGNsb25lID0gZnVuY3Rpb24gY2xvbmUyKCkge1xuICAgICAgdmFyIG9wdGlvbnMyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB2b2lkIDAgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICAgIHJldHVybiBtZWRpdW1ab29tMihfZXh0ZW5kcyh7fSwgem9vbU9wdGlvbnMsIG9wdGlvbnMyKSk7XG4gICAgfTtcbiAgICB2YXIgYXR0YWNoID0gZnVuY3Rpb24gYXR0YWNoMigpIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzZWxlY3RvcnMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgc2VsZWN0b3JzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuICAgICAgdmFyIG5ld0ltYWdlcyA9IHNlbGVjdG9ycy5yZWR1Y2UoZnVuY3Rpb24oaW1hZ2VzQWNjdW11bGF0b3IsIGN1cnJlbnRTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gW10uY29uY2F0KGltYWdlc0FjY3VtdWxhdG9yLCBnZXRJbWFnZXNGcm9tU2VsZWN0b3IoY3VycmVudFNlbGVjdG9yKSk7XG4gICAgICB9LCBbXSk7XG4gICAgICBuZXdJbWFnZXMuZmlsdGVyKGZ1bmN0aW9uKG5ld0ltYWdlKSB7XG4gICAgICAgIHJldHVybiBpbWFnZXMuaW5kZXhPZihuZXdJbWFnZSkgPT09IC0xO1xuICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihuZXdJbWFnZSkge1xuICAgICAgICBpbWFnZXMucHVzaChuZXdJbWFnZSk7XG4gICAgICAgIG5ld0ltYWdlLmNsYXNzTGlzdC5hZGQoXCJtZWRpdW0tem9vbS1pbWFnZVwiKTtcbiAgICAgIH0pO1xuICAgICAgZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihfcmVmKSB7XG4gICAgICAgIHZhciB0eXBlID0gX3JlZi50eXBlLCBsaXN0ZW5lciA9IF9yZWYubGlzdGVuZXIsIG9wdGlvbnMyID0gX3JlZi5vcHRpb25zO1xuICAgICAgICBuZXdJbWFnZXMuZm9yRWFjaChmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB6b29tO1xuICAgIH07XG4gICAgdmFyIGRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaDIoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIHNlbGVjdG9ycyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIHNlbGVjdG9yc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuICAgICAgaWYgKGFjdGl2ZS56b29tZWQpIHtcbiAgICAgICAgY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbWFnZXNUb0RldGFjaCA9IHNlbGVjdG9ycy5sZW5ndGggPiAwID8gc2VsZWN0b3JzLnJlZHVjZShmdW5jdGlvbihpbWFnZXNBY2N1bXVsYXRvciwgY3VycmVudFNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBbXS5jb25jYXQoaW1hZ2VzQWNjdW11bGF0b3IsIGdldEltYWdlc0Zyb21TZWxlY3RvcihjdXJyZW50U2VsZWN0b3IpKTtcbiAgICAgIH0sIFtdKSA6IGltYWdlcztcbiAgICAgIGltYWdlc1RvRGV0YWNoLmZvckVhY2goZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgaW1hZ2UuY2xhc3NMaXN0LnJlbW92ZShcIm1lZGl1bS16b29tLWltYWdlXCIpO1xuICAgICAgICBpbWFnZS5kaXNwYXRjaEV2ZW50KGNyZWF0ZUN1c3RvbUV2ZW50KFwibWVkaXVtLXpvb206ZGV0YWNoXCIsIHtcbiAgICAgICAgICBkZXRhaWw6IHsgem9vbSB9XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgICAgaW1hZ2VzID0gaW1hZ2VzLmZpbHRlcihmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICByZXR1cm4gaW1hZ2VzVG9EZXRhY2guaW5kZXhPZihpbWFnZSkgPT09IC0xO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gem9vbTtcbiAgICB9O1xuICAgIHZhciBvbiA9IGZ1bmN0aW9uIG9uMih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIG9wdGlvbnMyID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB2b2lkIDAgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICAgIGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJtZWRpdW0tem9vbTpcIiArIHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zMik7XG4gICAgICB9KTtcbiAgICAgIGV2ZW50TGlzdGVuZXJzLnB1c2goeyB0eXBlOiBcIm1lZGl1bS16b29tOlwiICsgdHlwZSwgbGlzdGVuZXIsIG9wdGlvbnM6IG9wdGlvbnMyIH0pO1xuICAgICAgcmV0dXJuIHpvb207XG4gICAgfTtcbiAgICB2YXIgb2ZmID0gZnVuY3Rpb24gb2ZmMih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIG9wdGlvbnMyID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB2b2lkIDAgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICAgIGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIGltYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZWRpdW0tem9vbTpcIiArIHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zMik7XG4gICAgICB9KTtcbiAgICAgIGV2ZW50TGlzdGVuZXJzID0gZXZlbnRMaXN0ZW5lcnMuZmlsdGVyKGZ1bmN0aW9uKGV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuICEoZXZlbnRMaXN0ZW5lci50eXBlID09PSBcIm1lZGl1bS16b29tOlwiICsgdHlwZSAmJiBldmVudExpc3RlbmVyLmxpc3RlbmVyLnRvU3RyaW5nKCkgPT09IGxpc3RlbmVyLnRvU3RyaW5nKCkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gem9vbTtcbiAgICB9O1xuICAgIHZhciBvcGVuID0gZnVuY3Rpb24gb3BlbjIoKSB7XG4gICAgICB2YXIgX3JlZjIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHZvaWQgMCA/IGFyZ3VtZW50c1swXSA6IHt9LCB0YXJnZXQgPSBfcmVmMi50YXJnZXQ7XG4gICAgICB2YXIgX2FuaW1hdGUgPSBmdW5jdGlvbiBfYW5pbWF0ZTIoKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB7XG4gICAgICAgICAgd2lkdGg6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgIH07XG4gICAgICAgIHZhciB2aWV3cG9ydFdpZHRoID0gdm9pZCAwO1xuICAgICAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSB2b2lkIDA7XG4gICAgICAgIGlmICh6b29tT3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgICAgICBpZiAoem9vbU9wdGlvbnMuY29udGFpbmVyIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICBjb250YWluZXIgPSBfZXh0ZW5kcyh7fSwgY29udGFpbmVyLCB6b29tT3B0aW9ucy5jb250YWluZXIpO1xuICAgICAgICAgICAgdmlld3BvcnRXaWR0aCA9IGNvbnRhaW5lci53aWR0aCAtIGNvbnRhaW5lci5sZWZ0IC0gY29udGFpbmVyLnJpZ2h0IC0gem9vbU9wdGlvbnMubWFyZ2luICogMjtcbiAgICAgICAgICAgIHZpZXdwb3J0SGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCAtIGNvbnRhaW5lci50b3AgLSBjb250YWluZXIuYm90dG9tIC0gem9vbU9wdGlvbnMubWFyZ2luICogMjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHpvb21Db250YWluZXIgPSBpc05vZGUoem9vbU9wdGlvbnMuY29udGFpbmVyKSA/IHpvb21PcHRpb25zLmNvbnRhaW5lciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioem9vbU9wdGlvbnMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciBfem9vbUNvbnRhaW5lciRnZXRCb3UgPSB6b29tQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBfd2lkdGggPSBfem9vbUNvbnRhaW5lciRnZXRCb3Uud2lkdGgsIF9oZWlnaHQgPSBfem9vbUNvbnRhaW5lciRnZXRCb3UuaGVpZ2h0LCBfbGVmdCA9IF96b29tQ29udGFpbmVyJGdldEJvdS5sZWZ0LCBfdG9wID0gX3pvb21Db250YWluZXIkZ2V0Qm91LnRvcDtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IF9leHRlbmRzKHt9LCBjb250YWluZXIsIHtcbiAgICAgICAgICAgICAgd2lkdGg6IF93aWR0aCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBfaGVpZ2h0LFxuICAgICAgICAgICAgICBsZWZ0OiBfbGVmdCxcbiAgICAgICAgICAgICAgdG9wOiBfdG9wXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGggfHwgY29udGFpbmVyLndpZHRoIC0gem9vbU9wdGlvbnMubWFyZ2luICogMjtcbiAgICAgICAgdmlld3BvcnRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodCB8fCBjb250YWluZXIuaGVpZ2h0IC0gem9vbU9wdGlvbnMubWFyZ2luICogMjtcbiAgICAgICAgdmFyIHpvb21UYXJnZXQgPSBhY3RpdmUuem9vbWVkSGQgfHwgYWN0aXZlLm9yaWdpbmFsO1xuICAgICAgICB2YXIgbmF0dXJhbFdpZHRoID0gaXNTdmcoem9vbVRhcmdldCkgPyB2aWV3cG9ydFdpZHRoIDogem9vbVRhcmdldC5uYXR1cmFsV2lkdGggfHwgdmlld3BvcnRXaWR0aDtcbiAgICAgICAgdmFyIG5hdHVyYWxIZWlnaHQgPSBpc1N2Zyh6b29tVGFyZ2V0KSA/IHZpZXdwb3J0SGVpZ2h0IDogem9vbVRhcmdldC5uYXR1cmFsSGVpZ2h0IHx8IHZpZXdwb3J0SGVpZ2h0O1xuICAgICAgICB2YXIgX3pvb21UYXJnZXQkZ2V0Qm91bmRpID0gem9vbVRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdG9wID0gX3pvb21UYXJnZXQkZ2V0Qm91bmRpLnRvcCwgbGVmdCA9IF96b29tVGFyZ2V0JGdldEJvdW5kaS5sZWZ0LCB3aWR0aCA9IF96b29tVGFyZ2V0JGdldEJvdW5kaS53aWR0aCwgaGVpZ2h0ID0gX3pvb21UYXJnZXQkZ2V0Qm91bmRpLmhlaWdodDtcbiAgICAgICAgdmFyIHNjYWxlWCA9IE1hdGgubWluKE1hdGgubWF4KHdpZHRoLCBuYXR1cmFsV2lkdGgpLCB2aWV3cG9ydFdpZHRoKSAvIHdpZHRoO1xuICAgICAgICB2YXIgc2NhbGVZID0gTWF0aC5taW4oTWF0aC5tYXgoaGVpZ2h0LCBuYXR1cmFsSGVpZ2h0KSwgdmlld3BvcnRIZWlnaHQpIC8gaGVpZ2h0O1xuICAgICAgICB2YXIgc2NhbGUgPSBNYXRoLm1pbihzY2FsZVgsIHNjYWxlWSk7XG4gICAgICAgIHZhciB0cmFuc2xhdGVYID0gKC1sZWZ0ICsgKHZpZXdwb3J0V2lkdGggLSB3aWR0aCkgLyAyICsgem9vbU9wdGlvbnMubWFyZ2luICsgY29udGFpbmVyLmxlZnQpIC8gc2NhbGU7XG4gICAgICAgIHZhciB0cmFuc2xhdGVZID0gKC10b3AgKyAodmlld3BvcnRIZWlnaHQgLSBoZWlnaHQpIC8gMiArIHpvb21PcHRpb25zLm1hcmdpbiArIGNvbnRhaW5lci50b3ApIC8gc2NhbGU7XG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSBcInNjYWxlKFwiICsgc2NhbGUgKyBcIikgdHJhbnNsYXRlM2QoXCIgKyB0cmFuc2xhdGVYICsgXCJweCwgXCIgKyB0cmFuc2xhdGVZICsgXCJweCwgMClcIjtcbiAgICAgICAgYWN0aXZlLnpvb21lZC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgICAgIGlmIChhY3RpdmUuem9vbWVkSGQpIHtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkSGQuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlMihmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIGlmICh0YXJnZXQgJiYgaW1hZ2VzLmluZGV4T2YodGFyZ2V0KSA9PT0gLTEpIHtcbiAgICAgICAgICByZXNvbHZlKHpvb20pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX2hhbmRsZU9wZW5FbmQgPSBmdW5jdGlvbiBfaGFuZGxlT3BlbkVuZDIoKSB7XG4gICAgICAgICAgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIF9oYW5kbGVPcGVuRW5kMik7XG4gICAgICAgICAgYWN0aXZlLm9yaWdpbmFsLmRpc3BhdGNoRXZlbnQoY3JlYXRlQ3VzdG9tRXZlbnQoXCJtZWRpdW0tem9vbTpvcGVuZWRcIiwge1xuICAgICAgICAgICAgZGV0YWlsOiB7IHpvb20gfVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgICByZXNvbHZlKHpvb20pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoYWN0aXZlLnpvb21lZCkge1xuICAgICAgICAgIHJlc29sdmUoem9vbSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICBhY3RpdmUub3JpZ2luYWwgPSB0YXJnZXQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgX2ltYWdlcyA9IGltYWdlcztcbiAgICAgICAgICBhY3RpdmUub3JpZ2luYWwgPSBfaW1hZ2VzWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoem9vbSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFjdGl2ZS5vcmlnaW5hbC5kaXNwYXRjaEV2ZW50KGNyZWF0ZUN1c3RvbUV2ZW50KFwibWVkaXVtLXpvb206b3BlblwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IHpvb20gfVxuICAgICAgICB9KSk7XG4gICAgICAgIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IDA7XG4gICAgICAgIGlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgYWN0aXZlLnpvb21lZCA9IGNsb25lVGFyZ2V0KGFjdGl2ZS5vcmlnaW5hbCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG4gICAgICAgIGlmICh6b29tT3B0aW9ucy50ZW1wbGF0ZSkge1xuICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IGlzTm9kZSh6b29tT3B0aW9ucy50ZW1wbGF0ZSkgPyB6b29tT3B0aW9ucy50ZW1wbGF0ZSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioem9vbU9wdGlvbnMudGVtcGxhdGUpO1xuICAgICAgICAgIGFjdGl2ZS50ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgYWN0aXZlLnRlbXBsYXRlLmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFjdGl2ZS50ZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGl2ZS5vcmlnaW5hbC5wYXJlbnRFbGVtZW50ICYmIGFjdGl2ZS5vcmlnaW5hbC5wYXJlbnRFbGVtZW50LnRhZ05hbWUgPT09IFwiUElDVFVSRVwiICYmIGFjdGl2ZS5vcmlnaW5hbC5jdXJyZW50U3JjKSB7XG4gICAgICAgICAgYWN0aXZlLnpvb21lZC5zcmMgPSBhY3RpdmUub3JpZ2luYWwuY3VycmVudFNyYztcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFjdGl2ZS56b29tZWQpO1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm1lZGl1bS16b29tLS1vcGVuZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBhY3RpdmUub3JpZ2luYWwuY2xhc3NMaXN0LmFkZChcIm1lZGl1bS16b29tLWltYWdlLS1oaWRkZW5cIik7XG4gICAgICAgIGFjdGl2ZS56b29tZWQuY2xhc3NMaXN0LmFkZChcIm1lZGl1bS16b29tLWltYWdlLS1vcGVuZWRcIik7XG4gICAgICAgIGFjdGl2ZS56b29tZWQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlKTtcbiAgICAgICAgYWN0aXZlLnpvb21lZC5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBfaGFuZGxlT3BlbkVuZCk7XG4gICAgICAgIGlmIChhY3RpdmUub3JpZ2luYWwuZ2V0QXR0cmlidXRlKFwiZGF0YS16b29tLXNyY1wiKSkge1xuICAgICAgICAgIGFjdGl2ZS56b29tZWRIZCA9IGFjdGl2ZS56b29tZWQuY2xvbmVOb2RlKCk7XG4gICAgICAgICAgYWN0aXZlLnpvb21lZEhkLnJlbW92ZUF0dHJpYnV0ZShcInNyY3NldFwiKTtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkSGQucmVtb3ZlQXR0cmlidXRlKFwic2l6ZXNcIik7XG4gICAgICAgICAgYWN0aXZlLnpvb21lZEhkLnJlbW92ZUF0dHJpYnV0ZShcImxvYWRpbmdcIik7XG4gICAgICAgICAgYWN0aXZlLnpvb21lZEhkLnNyYyA9IGFjdGl2ZS56b29tZWQuZ2V0QXR0cmlidXRlKFwiZGF0YS16b29tLXNyY1wiKTtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkSGQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnZXRab29tVGFyZ2V0U2l6ZSk7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmFibGUgdG8gcmVhY2ggdGhlIHpvb20gaW1hZ2UgdGFyZ2V0IFwiICsgYWN0aXZlLnpvb21lZEhkLnNyYyk7XG4gICAgICAgICAgICBhY3RpdmUuem9vbWVkSGQgPSBudWxsO1xuICAgICAgICAgICAgX2FuaW1hdGUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHZhciBnZXRab29tVGFyZ2V0U2l6ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGFjdGl2ZS56b29tZWRIZC5jb21wbGV0ZSkge1xuICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdldFpvb21UYXJnZXRTaXplKTtcbiAgICAgICAgICAgICAgYWN0aXZlLnpvb21lZEhkLmNsYXNzTGlzdC5hZGQoXCJtZWRpdW0tem9vbS1pbWFnZS0tb3BlbmVkXCIpO1xuICAgICAgICAgICAgICBhY3RpdmUuem9vbWVkSGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlKTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhY3RpdmUuem9vbWVkSGQpO1xuICAgICAgICAgICAgICBfYW5pbWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmUub3JpZ2luYWwuaGFzQXR0cmlidXRlKFwic3Jjc2V0XCIpKSB7XG4gICAgICAgICAgYWN0aXZlLnpvb21lZEhkID0gYWN0aXZlLnpvb21lZC5jbG9uZU5vZGUoKTtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkSGQucmVtb3ZlQXR0cmlidXRlKFwic2l6ZXNcIik7XG4gICAgICAgICAgYWN0aXZlLnpvb21lZEhkLnJlbW92ZUF0dHJpYnV0ZShcImxvYWRpbmdcIik7XG4gICAgICAgICAgdmFyIGxvYWRFdmVudExpc3RlbmVyID0gYWN0aXZlLnpvb21lZEhkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYWN0aXZlLnpvb21lZEhkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGxvYWRFdmVudExpc3RlbmVyKTtcbiAgICAgICAgICAgIGFjdGl2ZS56b29tZWRIZC5jbGFzc0xpc3QuYWRkKFwibWVkaXVtLXpvb20taW1hZ2UtLW9wZW5lZFwiKTtcbiAgICAgICAgICAgIGFjdGl2ZS56b29tZWRIZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2UpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhY3RpdmUuem9vbWVkSGQpO1xuICAgICAgICAgICAgX2FuaW1hdGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfYW5pbWF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlMigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTIoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBpZiAoaXNBbmltYXRpbmcgfHwgIWFjdGl2ZS5vcmlnaW5hbCkge1xuICAgICAgICAgIHJlc29sdmUoem9vbSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfaGFuZGxlQ2xvc2VFbmQgPSBmdW5jdGlvbiBfaGFuZGxlQ2xvc2VFbmQyKCkge1xuICAgICAgICAgIGFjdGl2ZS5vcmlnaW5hbC5jbGFzc0xpc3QucmVtb3ZlKFwibWVkaXVtLXpvb20taW1hZ2UtLWhpZGRlblwiKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGFjdGl2ZS56b29tZWQpO1xuICAgICAgICAgIGlmIChhY3RpdmUuem9vbWVkSGQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWN0aXZlLnpvb21lZEhkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChvdmVybGF5KTtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkLmNsYXNzTGlzdC5yZW1vdmUoXCJtZWRpdW0tem9vbS1pbWFnZS0tb3BlbmVkXCIpO1xuICAgICAgICAgIGlmIChhY3RpdmUudGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWN0aXZlLnRlbXBsYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIF9oYW5kbGVDbG9zZUVuZDIpO1xuICAgICAgICAgIGFjdGl2ZS5vcmlnaW5hbC5kaXNwYXRjaEV2ZW50KGNyZWF0ZUN1c3RvbUV2ZW50KFwibWVkaXVtLXpvb206Y2xvc2VkXCIsIHtcbiAgICAgICAgICAgIGRldGFpbDogeyB6b29tIH1cbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgYWN0aXZlLm9yaWdpbmFsID0gbnVsbDtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkID0gbnVsbDtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkSGQgPSBudWxsO1xuICAgICAgICAgIGFjdGl2ZS50ZW1wbGF0ZSA9IG51bGw7XG4gICAgICAgICAgcmVzb2x2ZSh6b29tKTtcbiAgICAgICAgfTtcbiAgICAgICAgaXNBbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJtZWRpdW0tem9vbS0tb3BlbmVkXCIpO1xuICAgICAgICBhY3RpdmUuem9vbWVkLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgIGlmIChhY3RpdmUuem9vbWVkSGQpIHtcbiAgICAgICAgICBhY3RpdmUuem9vbWVkSGQuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aXZlLnRlbXBsYXRlKSB7XG4gICAgICAgICAgYWN0aXZlLnRlbXBsYXRlLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMTUwbXNcIjtcbiAgICAgICAgICBhY3RpdmUudGVtcGxhdGUuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgYWN0aXZlLm9yaWdpbmFsLmRpc3BhdGNoRXZlbnQoY3JlYXRlQ3VzdG9tRXZlbnQoXCJtZWRpdW0tem9vbTpjbG9zZVwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IHpvb20gfVxuICAgICAgICB9KSk7XG4gICAgICAgIGFjdGl2ZS56b29tZWQuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgX2hhbmRsZUNsb3NlRW5kKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIHRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZTIoKSB7XG4gICAgICB2YXIgX3JlZjMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHZvaWQgMCA/IGFyZ3VtZW50c1swXSA6IHt9LCB0YXJnZXQgPSBfcmVmMy50YXJnZXQ7XG4gICAgICBpZiAoYWN0aXZlLm9yaWdpbmFsKSB7XG4gICAgICAgIHJldHVybiBjbG9zZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wZW4oeyB0YXJnZXQgfSk7XG4gICAgfTtcbiAgICB2YXIgZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIGdldE9wdGlvbnMyKCkge1xuICAgICAgcmV0dXJuIHpvb21PcHRpb25zO1xuICAgIH07XG4gICAgdmFyIGdldEltYWdlcyA9IGZ1bmN0aW9uIGdldEltYWdlczIoKSB7XG4gICAgICByZXR1cm4gaW1hZ2VzO1xuICAgIH07XG4gICAgdmFyIGdldFpvb21lZEltYWdlID0gZnVuY3Rpb24gZ2V0Wm9vbWVkSW1hZ2UyKCkge1xuICAgICAgcmV0dXJuIGFjdGl2ZS5vcmlnaW5hbDtcbiAgICB9O1xuICAgIHZhciBpbWFnZXMgPSBbXTtcbiAgICB2YXIgZXZlbnRMaXN0ZW5lcnMgPSBbXTtcbiAgICB2YXIgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICB2YXIgc2Nyb2xsVG9wID0gMDtcbiAgICB2YXIgem9vbU9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHZhciBhY3RpdmUgPSB7XG4gICAgICBvcmlnaW5hbDogbnVsbCxcbiAgICAgIHpvb21lZDogbnVsbCxcbiAgICAgIHpvb21lZEhkOiBudWxsLFxuICAgICAgdGVtcGxhdGU6IG51bGxcbiAgICAgIC8vIElmIHRoZSBzZWxlY3RvciBpcyBvbWl0dGVkLCBpdCdzIHJlcGxhY2VkIGJ5IHRoZSBvcHRpb25zXG4gICAgfTtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHNlbGVjdG9yKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgem9vbU9wdGlvbnMgPSBzZWxlY3RvcjtcbiAgICB9IGVsc2UgaWYgKHNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgYXR0YWNoKHNlbGVjdG9yKTtcbiAgICB9XG4gICAgem9vbU9wdGlvbnMgPSBfZXh0ZW5kcyh7XG4gICAgICBtYXJnaW46IDAsXG4gICAgICBiYWNrZ3JvdW5kOiBcIiNmZmZcIixcbiAgICAgIHNjcm9sbE9mZnNldDogNDAsXG4gICAgICBjb250YWluZXI6IG51bGwsXG4gICAgICB0ZW1wbGF0ZTogbnVsbFxuICAgIH0sIHpvb21PcHRpb25zKTtcbiAgICB2YXIgb3ZlcmxheSA9IGNyZWF0ZU92ZXJsYXkoem9vbU9wdGlvbnMuYmFja2dyb3VuZCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9oYW5kbGVDbGljayk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIF9oYW5kbGVLZXlVcCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBfaGFuZGxlU2Nyb2xsKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBjbG9zZSk7XG4gICAgdmFyIHpvb20gPSB7XG4gICAgICBvcGVuLFxuICAgICAgY2xvc2UsXG4gICAgICB0b2dnbGUsXG4gICAgICB1cGRhdGUsXG4gICAgICBjbG9uZSxcbiAgICAgIGF0dGFjaCxcbiAgICAgIGRldGFjaCxcbiAgICAgIG9uLFxuICAgICAgb2ZmLFxuICAgICAgZ2V0T3B0aW9ucyxcbiAgICAgIGdldEltYWdlcyxcbiAgICAgIGdldFpvb21lZEltYWdlXG4gICAgfTtcbiAgICByZXR1cm4gem9vbTtcbiAgfTtcbiAgZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzMiwgcmVmKSB7XG4gICAgaWYgKHJlZiA9PT0gdm9pZCAwKVxuICAgICAgcmVmID0ge307XG4gICAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuICAgIGlmICghY3NzMiB8fCB0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcbiAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgc3R5bGUudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICBpZiAoaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcbiAgICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3MyO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MyKSk7XG4gICAgfVxuICB9XG4gIHZhciBjc3MgPSBcIi5tZWRpdW0tem9vbS1vdmVybGF5e3Bvc2l0aW9uOmZpeGVkO3RvcDowO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO29wYWNpdHk6MDt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzO3dpbGwtY2hhbmdlOm9wYWNpdHl9Lm1lZGl1bS16b29tLS1vcGVuZWQgLm1lZGl1bS16b29tLW92ZXJsYXl7Y3Vyc29yOnBvaW50ZXI7Y3Vyc29yOnpvb20tb3V0O29wYWNpdHk6MX0ubWVkaXVtLXpvb20taW1hZ2V7Y3Vyc29yOnBvaW50ZXI7Y3Vyc29yOnpvb20taW47dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjNzIGN1YmljLWJlemllciguMiwwLC4yLDEpIWltcG9ydGFudH0ubWVkaXVtLXpvb20taW1hZ2UtLWhpZGRlbnt2aXNpYmlsaXR5OmhpZGRlbn0ubWVkaXVtLXpvb20taW1hZ2UtLW9wZW5lZHtwb3NpdGlvbjpyZWxhdGl2ZTtjdXJzb3I6cG9pbnRlcjtjdXJzb3I6em9vbS1vdXQ7d2lsbC1jaGFuZ2U6dHJhbnNmb3JtfVwiO1xuICBzdHlsZUluamVjdChjc3MpO1xuICB2YXIgbWVkaXVtX3pvb21fZXNtX2RlZmF1bHQgPSBtZWRpdW1ab29tO1xuXG4gIC8vIG5zLXBhcmFtczpAcGFyYW1zXG4gIHZhciBodWdvRW52aXJvbm1lbnQgPSBcImRldmVsb3BtZW50XCI7XG4gIHZhciBpMThuID0geyBjb3BpZWQ6IFwiQ29waWVkXCIsIGNvcHk6IFwiQ29weVwiIH07XG4gIHZhciBzZWFyY2hFbmFibGVkID0gdHJ1ZTtcblxuICAvLyBucy1odWdvOkM6XFxVc2Vyc1xcc3BlbGFlejNcXEdhVGVjaCBEcm9wYm94XFxTZXJnaW8gUGVsYWV6XFxKb2IgQXBwbGljYXRpb25cXEFjYWRlbWljXFx3ZWJzaXRlXFx0aGVtZXNcXGdpdGh1Yi5jb21cXEh1Z29CbG94XFxodWdvLWJsb3gtYnVpbGRlclxcbW9kdWxlc1xcYmxveC1ib290c3RyYXBcXHY1XFxhc3NldHNcXGpzXFx3b3djaGVteS11dGlscy5qc1xuICBmdW5jdGlvbiBzY3JvbGxQYXJlbnRUb0NoaWxkKHBhcmVudCwgY2hpbGQpIHtcbiAgICBjb25zdCBwYXJlbnRSZWN0ID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHBhcmVudFZpZXdhYmxlQXJlYSA9IHtcbiAgICAgIGhlaWdodDogcGFyZW50LmNsaWVudEhlaWdodCxcbiAgICAgIHdpZHRoOiBwYXJlbnQuY2xpZW50V2lkdGhcbiAgICB9O1xuICAgIGNvbnN0IGNoaWxkUmVjdCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGlzQ2hpbGRJblZpZXcgPSBjaGlsZFJlY3QudG9wID49IHBhcmVudFJlY3QudG9wICYmIGNoaWxkUmVjdC5ib3R0b20gPD0gcGFyZW50UmVjdC50b3AgKyBwYXJlbnRWaWV3YWJsZUFyZWEuaGVpZ2h0O1xuICAgIGlmICghaXNDaGlsZEluVmlldykge1xuICAgICAgcGFyZW50LnNjcm9sbFRvcCA9IGNoaWxkUmVjdC50b3AgKyBwYXJlbnQuc2Nyb2xsVG9wIC0gcGFyZW50UmVjdC50b3A7XG4gICAgfVxuICB9XG5cbiAgLy8gbnMtaHVnbzpDOlxcVXNlcnNcXHNwZWxhZXozXFxHYVRlY2ggRHJvcGJveFxcU2VyZ2lvIFBlbGFlelxcSm9iIEFwcGxpY2F0aW9uXFxBY2FkZW1pY1xcd2Vic2l0ZVxcdGhlbWVzXFxnaXRodWIuY29tXFxIdWdvQmxveFxcaHVnby1ibG94LWJ1aWxkZXJcXG1vZHVsZXNcXGJsb3gtYm9vdHN0cmFwXFx2NVxcYXNzZXRzXFxqc1xcd293Y2hlbXktbmF2aWdhdGlvbi5qc1xuICBmdW5jdGlvbiBnZXROYXZCYXJIZWlnaHQoKSB7XG4gICAgbGV0IG5hdmJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmF2YmFyLW1haW5cIik7XG4gICAgbGV0IG5hdmJhckhlaWdodCA9IG5hdmJhciA/IG5hdmJhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgOiAwO1xuICAgIGNvbnNvbGUuZGVidWcoXCJOYXZiYXIgaGVpZ2h0OiBcIiArIG5hdmJhckhlaWdodCk7XG4gICAgcmV0dXJuIG5hdmJhckhlaWdodDtcbiAgfVxuICBmdW5jdGlvbiBzY3JvbGxUb0FuY2hvcih0YXJnZXQsIGR1cmF0aW9uID0gMCkge1xuICAgIHRhcmdldCA9IHR5cGVvZiB0YXJnZXQgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIiA/IGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCkgOiB0YXJnZXQ7XG4gICAgaWYgKCQodGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgIHRhcmdldCA9IFwiI1wiICsgJC5lc2NhcGVTZWxlY3Rvcih0YXJnZXQuc3Vic3RyaW5nKDEpKTtcbiAgICAgIGxldCBlbGVtZW50T2Zmc2V0ID0gTWF0aC5jZWlsKCQodGFyZ2V0KS5vZmZzZXQoKS50b3AgLSBnZXROYXZCYXJIZWlnaHQoKSk7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5jbGFzc0xpc3QuYWRkKFwic2Nyb2xsaW5nXCIpO1xuICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZShcbiAgICAgICAge1xuICAgICAgICAgIHNjcm9sbFRvcDogZWxlbWVudE9mZnNldFxuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuY2xhc3NMaXN0LnJlbW92ZShcInNjcm9sbGluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIkNhbm5vdCBzY3JvbGwgdG8gdGFyZ2V0IGAjXCIgKyB0YXJnZXQgKyBcImAuIElEIG5vdCBmb3VuZCFcIik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZpeFNjcm9sbHNweSgpIHtcbiAgICBsZXQgJGJvZHkgPSAkKFwiYm9keVwiKTtcbiAgICBsZXQgZGF0YSA9ICRib2R5LmRhdGEoXCJicy5zY3JvbGxzcHlcIik7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGRhdGEuX2NvbmZpZy5vZmZzZXQgPSBnZXROYXZCYXJIZWlnaHQoKTtcbiAgICAgICRib2R5LmRhdGEoXCJicy5zY3JvbGxzcHlcIiwgZGF0YSk7XG4gICAgICAkYm9keS5zY3JvbGxzcHkoXCJyZWZyZXNoXCIpO1xuICAgIH1cbiAgfVxuICAkKFwiI25hdmJhci1tYWluIGxpLm5hdi1pdGVtIGEubmF2LWxpbmssIC5qcy1zY3JvbGxcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgIGxldCBoYXNoID0gdGhpcy5oYXNoO1xuICAgIGlmICh0aGlzLnBhdGhuYW1lID09PSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgJiYgaGFzaCAmJiAkKGhhc2gpLmxlbmd0aCAmJiAkKFwiLmpzLXdpZGdldC1wYWdlXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZXQgZWxlbWVudE9mZnNldCA9IE1hdGguY2VpbCgkKGhhc2gpLm9mZnNldCgpLnRvcCAtIGdldE5hdkJhckhlaWdodCgpKTtcbiAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY3JvbGxUb3A6IGVsZW1lbnRPZmZzZXRcbiAgICAgICAgfSxcbiAgICAgICAgODAwXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG4gICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIubmF2YmFyLWNvbGxhcHNlLnNob3dcIiwgZnVuY3Rpb24oZSkge1xuICAgIGxldCB0YXJnZXRFbGVtZW50ID0gJChlLnRhcmdldCkuaXMoXCJhXCIpID8gJChlLnRhcmdldCkgOiAkKGUudGFyZ2V0KS5wYXJlbnQoKTtcbiAgICBpZiAodGFyZ2V0RWxlbWVudC5pcyhcImFcIikgJiYgdGFyZ2V0RWxlbWVudC5hdHRyKFwiY2xhc3NcIikgIT0gXCJkcm9wZG93bi10b2dnbGVcIikge1xuICAgICAgJCh0aGlzKS5jb2xsYXBzZShcImhpZGVcIik7XG4gICAgfVxuICB9KTtcbiAgJChcImJvZHlcIikub24oXCJtb3VzZWVudGVyIG1vdXNlbGVhdmVcIiwgXCIuZHJvcGRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBkcm9wZG93biA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoXCIuZHJvcGRvd25cIik7XG4gICAgdmFyIG1lbnUgPSAkKFwiLmRyb3Bkb3duLW1lbnVcIiwgZHJvcGRvd24pO1xuICAgIGRyb3Bkb3duLmFkZENsYXNzKFwic2hvd1wiKTtcbiAgICBtZW51LmFkZENsYXNzKFwic2hvd1wiKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZHJvcGRvd25bZHJvcGRvd24uaXMoXCI6aG92ZXJcIikgPyBcImFkZENsYXNzXCIgOiBcInJlbW92ZUNsYXNzXCJdKFwic2hvd1wiKTtcbiAgICAgIG1lbnVbZHJvcGRvd24uaXMoXCI6aG92ZXJcIikgPyBcImFkZENsYXNzXCIgOiBcInJlbW92ZUNsYXNzXCJdKFwic2hvd1wiKTtcbiAgICB9LCAzMDApO1xuICB9KTtcbiAgdmFyIHJlc2l6ZVRpbWVyO1xuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgcmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KGZpeFNjcm9sbHNweSwgMjAwKTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCBzY3JvbGxUb0FuY2hvcik7XG5cbiAgLy8gbnMtaHVnbzpDOlxcVXNlcnNcXHNwZWxhZXozXFxHYVRlY2ggRHJvcGJveFxcU2VyZ2lvIFBlbGFlelxcSm9iIEFwcGxpY2F0aW9uXFxBY2FkZW1pY1xcd2Vic2l0ZVxcdGhlbWVzXFxnaXRodWIuY29tXFxIdWdvQmxveFxcaHVnby1ibG94LWJ1aWxkZXJcXG1vZHVsZXNcXGJsb3gtYm9vdHN0cmFwXFx2NVxcYXNzZXRzXFxqc1xcd293Y2hlbXktZ2l0aHViLmpzXG4gIGZ1bmN0aW9uIHByaW50TGF0ZXN0UmVsZWFzZShzZWxlY3RvciwgcmVwbykge1xuICAgIGlmIChodWdvRW52aXJvbm1lbnQgPT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAkLmdldEpTT04oXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL1wiICsgcmVwbyArIFwiL3RhZ3NcIikuZG9uZShmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIGxldCByZWxlYXNlID0ganNvblswXTtcbiAgICAgICAgJChzZWxlY3RvcikuYXBwZW5kKFwiIFwiICsgcmVsZWFzZS5uYW1lKTtcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgIGxldCBlcnIgPSB0ZXh0U3RhdHVzICsgXCIsIFwiICsgZXJyb3I7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdCBGYWlsZWQ6IFwiICsgZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIG5zLWh1Z286QzpcXFVzZXJzXFxzcGVsYWV6M1xcR2FUZWNoIERyb3Bib3hcXFNlcmdpbyBQZWxhZXpcXEpvYiBBcHBsaWNhdGlvblxcQWNhZGVtaWNcXHdlYnNpdGVcXHRoZW1lc1xcZ2l0aHViLmNvbVxcSHVnb0Jsb3hcXGh1Z28tYmxveC1idWlsZGVyXFxtb2R1bGVzXFxibG94LWJvb3RzdHJhcFxcdjVcXGFzc2V0c1xcanNcXHdvd2NoZW15LWFuaW1hdGlvbi5qc1xuICBmdW5jdGlvbiBmYWRlSW4oZWxlbWVudCwgZHVyYXRpb24gPSA2MDApIHtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgIGxldCBsYXN0ID0gKy8qIEBfX1BVUkVfXyAqLyBuZXcgRGF0ZSgpO1xuICAgIGxldCB0aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAoK2VsZW1lbnQuc3R5bGUub3BhY2l0eSArICgvKiBAX19QVVJFX18gKi8gbmV3IERhdGUoKSAtIGxhc3QpIC8gZHVyYXRpb24pLnRvU3RyaW5nKCk7XG4gICAgICBsYXN0ID0gKy8qIEBfX1BVUkVfXyAqLyBuZXcgRGF0ZSgpO1xuICAgICAgaWYgKCtlbGVtZW50LnN0eWxlLm9wYWNpdHkgPCAxKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spIHx8IHNldFRpbWVvdXQodGljaywgMTYpO1xuICAgICAgfVxuICAgIH07XG4gICAgdGljaygpO1xuICB9XG5cbiAgLy8gbnMtaHVnbzpDOlxcVXNlcnNcXHNwZWxhZXozXFxHYVRlY2ggRHJvcGJveFxcU2VyZ2lvIFBlbGFlelxcSm9iIEFwcGxpY2F0aW9uXFxBY2FkZW1pY1xcd2Vic2l0ZVxcdGhlbWVzXFxnaXRodWIuY29tXFxIdWdvQmxveFxcaHVnby1ibG94LWJ1aWxkZXJcXG1vZHVsZXNcXGJsb3gtYm9vdHN0cmFwXFx2NVxcYXNzZXRzXFxqc1xcd293Y2hlbXktdGhlbWluZy5qc1xuICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGZ1bmN0aW9uIGdldFRoZW1lTW9kZSgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ3Y1RoZW1lXCIpIHx8IDIpO1xuICB9XG4gIGZ1bmN0aW9uIGNhbkNoYW5nZVRoZW1lKCkge1xuICAgIHJldHVybiBCb29sZWFuKHdpbmRvdy53Yy5kYXJrTGlnaHRFbmFibGVkKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0VGhlbWVWYXJpYXRpb24oKSB7XG4gICAgaWYgKCFjYW5DaGFuZ2VUaGVtZSgpKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFwiVXNlciB0aGVtaW5nIGRpc2FibGVkLlwiKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzRGFya1RoZW1lOiB3aW5kb3cud2MuaXNTaXRlVGhlbWVEYXJrLFxuICAgICAgICB0aGVtZU1vZGU6IHdpbmRvdy53Yy5pc1NpdGVUaGVtZURhcmsgPyAxIDogMFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1ZyhcIlVzZXIgdGhlbWluZyBlbmFibGVkLlwiKTtcbiAgICBsZXQgaXNEYXJrVGhlbWU7XG4gICAgbGV0IGN1cnJlbnRUaGVtZU1vZGUgPSBnZXRUaGVtZU1vZGUoKTtcbiAgICBjb25zb2xlLmRlYnVnKGBVc2VyJ3MgdGhlbWUgdmFyaWF0aW9uOiAke2N1cnJlbnRUaGVtZU1vZGV9YCk7XG4gICAgc3dpdGNoIChjdXJyZW50VGhlbWVNb2RlKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGlzRGFya1RoZW1lID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpc0RhcmtUaGVtZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKS5tYXRjaGVzKSB7XG4gICAgICAgICAgaXNEYXJrVGhlbWUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodClcIikubWF0Y2hlcykge1xuICAgICAgICAgIGlzRGFya1RoZW1lID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNEYXJrVGhlbWUgPSB3aW5kb3cud2MuaXNTaXRlVGhlbWVEYXJrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoaXNEYXJrVGhlbWUgJiYgIWJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGFya1wiKSkge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIkFwcGx5aW5nIEh1Z28gQmxveCBCdWlsZGVyIGRhcmsgdGhlbWVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJkYXJrXCIpO1xuICAgIH0gZWxzZSBpZiAoIWlzRGFya1RoZW1lICYmIGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGFya1wiKSkge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIkFwcGx5aW5nIEh1Z28gQmxveCBCdWlsZGVyIGxpZ2h0IHRoZW1lXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiZGFya1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzRGFya1RoZW1lLFxuICAgICAgdGhlbWVNb2RlOiBjdXJyZW50VGhlbWVNb2RlXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBjaGFuZ2VUaGVtZU1vZGVDbGljayhuZXdNb2RlKSB7XG4gICAgaWYgKCFjYW5DaGFuZ2VUaGVtZSgpKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFwiQ2Fubm90IGNoYW5nZSB0aGVtZSAtIHVzZXIgdGhlbWluZyBkaXNhYmxlZC5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBpc0RhcmtUaGVtZTtcbiAgICBzd2l0Y2ggKG5ld01vZGUpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ3Y1RoZW1lXCIsIFwiMFwiKTtcbiAgICAgICAgaXNEYXJrVGhlbWUgPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlVzZXIgY2hhbmdlZCB0aGVtZSB2YXJpYXRpb24gdG8gTGlnaHQuXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ3Y1RoZW1lXCIsIFwiMVwiKTtcbiAgICAgICAgaXNEYXJrVGhlbWUgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiVXNlciBjaGFuZ2VkIHRoZW1lIHZhcmlhdGlvbiB0byBEYXJrLlwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIndjVGhlbWVcIiwgXCIyXCIpO1xuICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpLm1hdGNoZXMpIHtcbiAgICAgICAgICBpc0RhcmtUaGVtZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGxpZ2h0KVwiKS5tYXRjaGVzKSB7XG4gICAgICAgICAgaXNEYXJrVGhlbWUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc0RhcmtUaGVtZSA9IHdpbmRvdy53Yy5pc1NpdGVUaGVtZURhcms7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlVzZXIgY2hhbmdlZCB0aGVtZSB2YXJpYXRpb24gdG8gQXV0by5cIik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZW5kZXJUaGVtZVZhcmlhdGlvbihpc0RhcmtUaGVtZSwgbmV3TW9kZSk7XG4gIH1cbiAgZnVuY3Rpb24gc2hvd0FjdGl2ZVRoZW1lKG1vZGUpIHtcbiAgICBsZXQgbGlua0xpZ2h0MiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanMtc2V0LXRoZW1lLWxpZ2h0XCIpO1xuICAgIGxldCBsaW5rRGFyazIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmpzLXNldC10aGVtZS1kYXJrXCIpO1xuICAgIGxldCBsaW5rQXV0bzIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmpzLXNldC10aGVtZS1hdXRvXCIpO1xuICAgIGlmIChsaW5rTGlnaHQyID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBsaW5rTGlnaHQyLmNsYXNzTGlzdC5hZGQoXCJkcm9wZG93bi1pdGVtLWFjdGl2ZVwiKTtcbiAgICAgICAgbGlua0RhcmsyLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wZG93bi1pdGVtLWFjdGl2ZVwiKTtcbiAgICAgICAgbGlua0F1dG8yLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wZG93bi1pdGVtLWFjdGl2ZVwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxpbmtMaWdodDIuY2xhc3NMaXN0LnJlbW92ZShcImRyb3Bkb3duLWl0ZW0tYWN0aXZlXCIpO1xuICAgICAgICBsaW5rRGFyazIuY2xhc3NMaXN0LmFkZChcImRyb3Bkb3duLWl0ZW0tYWN0aXZlXCIpO1xuICAgICAgICBsaW5rQXV0bzIuY2xhc3NMaXN0LnJlbW92ZShcImRyb3Bkb3duLWl0ZW0tYWN0aXZlXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxpbmtMaWdodDIuY2xhc3NMaXN0LnJlbW92ZShcImRyb3Bkb3duLWl0ZW0tYWN0aXZlXCIpO1xuICAgICAgICBsaW5rRGFyazIuY2xhc3NMaXN0LnJlbW92ZShcImRyb3Bkb3duLWl0ZW0tYWN0aXZlXCIpO1xuICAgICAgICBsaW5rQXV0bzIuY2xhc3NMaXN0LmFkZChcImRyb3Bkb3duLWl0ZW0tYWN0aXZlXCIpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyVGhlbWVWYXJpYXRpb24oaXNEYXJrVGhlbWUsIHRoZW1lTW9kZSA9IDIsIGluaXQgPSBmYWxzZSkge1xuICAgIGNvbnN0IGNvZGVIbExpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxpbmtbdGl0bGU9aGwtbGlnaHRdXCIpO1xuICAgIGNvbnN0IGNvZGVIbERhcmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGlua1t0aXRsZT1obC1kYXJrXVwiKTtcbiAgICBjb25zdCBjb2RlSGxFbmFibGVkID0gY29kZUhsTGlnaHQgIT09IG51bGwgfHwgY29kZUhsRGFyayAhPT0gbnVsbDtcbiAgICBjb25zdCBkaWFncmFtRW5hYmxlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzY3JpcHRbdGl0bGU9bWVybWFpZF1cIikgIT09IG51bGw7XG4gICAgc2hvd0FjdGl2ZVRoZW1lKHRoZW1lTW9kZSk7XG4gICAgY29uc3QgdGhlbWVDaGFuZ2VFdmVudCA9IG5ldyBDdXN0b21FdmVudChcIndjVGhlbWVDaGFuZ2VcIiwgeyBkZXRhaWw6IHsgaXNEYXJrVGhlbWU6ICgpID0+IGlzRGFya1RoZW1lIH0gfSk7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGVtZUNoYW5nZUV2ZW50KTtcbiAgICBpZiAoIWluaXQpIHtcbiAgICAgIGlmIChpc0RhcmtUaGVtZSA9PT0gZmFsc2UgJiYgIWJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGFya1wiKSB8fCBpc0RhcmtUaGVtZSA9PT0gdHJ1ZSAmJiBib2R5LmNsYXNzTGlzdC5jb250YWlucyhcImRhcmtcIikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNEYXJrVGhlbWUgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoIWluaXQpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkb2N1bWVudC5ib2R5LnN0eWxlLCB7IG9wYWNpdHk6IDAsIHZpc2liaWxpdHk6IFwidmlzaWJsZVwiIH0pO1xuICAgICAgICBmYWRlSW4oZG9jdW1lbnQuYm9keSwgNjAwKTtcbiAgICAgIH1cbiAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZShcImRhcmtcIik7XG4gICAgICBpZiAoY29kZUhsRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiU2V0dGluZyBITEpTIHRoZW1lIHRvIGxpZ2h0XCIpO1xuICAgICAgICBpZiAoY29kZUhsTGlnaHQpIHtcbiAgICAgICAgICBjb2RlSGxMaWdodC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2RlSGxEYXJrKSB7XG4gICAgICAgICAgY29kZUhsRGFyay5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaWFncmFtRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiSW5pdGlhbGl6aW5nIE1lcm1haWQgd2l0aCBsaWdodCB0aGVtZVwiKTtcbiAgICAgICAgaWYgKGluaXQpIHtcbiAgICAgICAgICB3aW5kb3cubWVybWFpZC5pbml0aWFsaXplKHsgc3RhcnRPbkxvYWQ6IHRydWUsIHRoZW1lOiBcImRlZmF1bHRcIiwgc2VjdXJpdHlMZXZlbDogXCJsb29zZVwiIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc0RhcmtUaGVtZSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKCFpbml0KSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuYm9keS5zdHlsZSwgeyBvcGFjaXR5OiAwLCB2aXNpYmlsaXR5OiBcInZpc2libGVcIiB9KTtcbiAgICAgICAgZmFkZUluKGRvY3VtZW50LmJvZHksIDYwMCk7XG4gICAgICB9XG4gICAgICBib2R5LmNsYXNzTGlzdC5hZGQoXCJkYXJrXCIpO1xuICAgICAgaWYgKGNvZGVIbEVuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlNldHRpbmcgSExKUyB0aGVtZSB0byBkYXJrXCIpO1xuICAgICAgICBpZiAoY29kZUhsTGlnaHQpIHtcbiAgICAgICAgICBjb2RlSGxMaWdodC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvZGVIbERhcmspIHtcbiAgICAgICAgICBjb2RlSGxEYXJrLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaWFncmFtRW5hYmxlZCkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiSW5pdGlhbGl6aW5nIE1lcm1haWQgd2l0aCBkYXJrIHRoZW1lXCIpO1xuICAgICAgICBpZiAoaW5pdCkge1xuICAgICAgICAgIHdpbmRvdy5tZXJtYWlkLmluaXRpYWxpemUoeyBzdGFydE9uTG9hZDogdHJ1ZSwgdGhlbWU6IFwiZGFya1wiLCBzZWN1cml0eUxldmVsOiBcImxvb3NlXCIgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25NZWRpYVF1ZXJ5TGlzdEV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKCFjYW5DaGFuZ2VUaGVtZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRhcmtNb2RlT24gPSBldmVudC5tYXRjaGVzO1xuICAgIGNvbnNvbGUuZGVidWcoYE9TIGRhcmsgbW9kZSBwcmVmZXJlbmNlIGNoYW5nZWQgdG8gJHtkYXJrTW9kZU9uID8gXCJcXHV7MUYzMTJ9IG9uXCIgOiBcIlxcdTI2MDBcXHVGRTBGIG9mZlwifS5gKTtcbiAgICBsZXQgY3VycmVudFRoZW1lVmFyaWF0aW9uID0gZ2V0VGhlbWVNb2RlKCk7XG4gICAgbGV0IGlzRGFya1RoZW1lO1xuICAgIGlmIChjdXJyZW50VGhlbWVWYXJpYXRpb24gPT09IDIpIHtcbiAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIikubWF0Y2hlcykge1xuICAgICAgICBpc0RhcmtUaGVtZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodClcIikubWF0Y2hlcykge1xuICAgICAgICBpc0RhcmtUaGVtZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNEYXJrVGhlbWUgPSB3aW5kb3cud2MuaXNTaXRlVGhlbWVEYXJrO1xuICAgICAgfVxuICAgICAgcmVuZGVyVGhlbWVWYXJpYXRpb24oaXNEYXJrVGhlbWUsIGN1cnJlbnRUaGVtZVZhcmlhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLy8gPHN0ZGluPlxuICBjb25zb2xlLmRlYnVnKGBFbnZpcm9ubWVudDogJHtodWdvRW52aXJvbm1lbnR9YCk7XG4gIGZ1bmN0aW9uIHJlbW92ZVF1ZXJ5UGFyYW1zRnJvbVVybCgpIHtcbiAgICBpZiAod2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKSB7XG4gICAgICBsZXQgdXJsV2l0aG91dFNlYXJjaFBhcmFtcyA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLmhhc2g7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBwYXRoOiB1cmxXaXRob3V0U2VhcmNoUGFyYW1zIH0sIFwiXCIsIHVybFdpdGhvdXRTZWFyY2hQYXJhbXMpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB0b2dnbGVTZWFyY2hEaWFsb2coKSB7XG4gICAgY29uc3QgYm9keTIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcbiAgICBpZiAoYm9keTIuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VhcmNoaW5nXCIpKSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1xdWVyeVwiKS5ibHVyKCk7XG4gICAgICBib2R5Mi5jbGFzc0xpc3QucmVtb3ZlKFwic2VhcmNoaW5nXCIsIFwiY29tcGVuc2F0ZS1mb3Itc2Nyb2xsYmFyXCIpO1xuICAgICAgcmVtb3ZlUXVlcnlQYXJhbXNGcm9tVXJsKCk7XG4gICAgICAkKFwiI2ZhbmN5Ym94LXN0eWxlLW5vc2Nyb2xsXCIpLnJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoISQoXCIjZmFuY3lib3gtc3R5bGUtbm9zY3JvbGxcIikubGVuZ3RoICYmIGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICQoXCJoZWFkXCIpLmFwcGVuZChcbiAgICAgICAgICAnPHN0eWxlIGlkPVwiZmFuY3lib3gtc3R5bGUtbm9zY3JvbGxcIj4uY29tcGVuc2F0ZS1mb3Itc2Nyb2xsYmFye21hcmdpbi1yaWdodDonICsgKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSArIFwicHg7fTwvc3R5bGU+XCJcbiAgICAgICAgKTtcbiAgICAgICAgYm9keTIuY2xhc3NMaXN0LmFkZChcImNvbXBlbnNhdGUtZm9yLXNjcm9sbGJhclwiKTtcbiAgICAgIH1cbiAgICAgIGJvZHkyLmNsYXNzTGlzdC5hZGQoXCJzZWFyY2hpbmdcIik7XG4gICAgICAkKFwiLnNlYXJjaC1yZXN1bHRzXCIpLmNzcyh7IG9wYWNpdHk6IDAsIHZpc2liaWxpdHk6IFwidmlzaWJsZVwiIH0pLmFuaW1hdGUoeyBvcGFjaXR5OiAxIH0sIDIwMCk7XG4gICAgICBsZXQgYWxnb2xpYVNlYXJjaEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWlzLVNlYXJjaEJveC1pbnB1dFwiKTtcbiAgICAgIGlmIChhbGdvbGlhU2VhcmNoQm94KSB7XG4gICAgICAgIGFsZ29saWFTZWFyY2hCb3guZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLXF1ZXJ5XCIpLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZpeEh1Z29PdXRwdXQoKSB7XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjVGFibGVPZkNvbnRlbnRzXCIpKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1RhYmxlT2ZDb250ZW50c1wiKS5jbGFzc0xpc3QuYWRkKFwibmF2XCIsIFwiZmxleC1jb2x1bW5cIik7XG4gICAgfVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjVGFibGVPZkNvbnRlbnRzIGxpXCIpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZChcIm5hdi1pdGVtXCIpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjVGFibGVPZkNvbnRlbnRzIGxpIGFcIikuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgbGluay5jbGFzc0xpc3QuYWRkKFwibmF2LWxpbmtcIik7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W3R5cGU9J2NoZWNrYm94J11bZGlzYWJsZWRdXCIpLmZvckVhY2goKGNoZWNrYm94KSA9PiB7XG4gICAgICBjaGVja2JveC5jbG9zZXN0KFwidWxcIikuY2xhc3NMaXN0LmFkZChcInRhc2stbGlzdFwiKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGFibGVcIikuZm9yRWFjaCgodGFibGUpID0+IHtcbiAgICAgIHRhYmxlLmNsYXNzTGlzdC5hZGQoXCJ0YWJsZVwiKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBnZXRTaWJsaW5ncyhlbGVtKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlbGVtLnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uKHNpYmxpbmcpIHtcbiAgICAgIHJldHVybiBzaWJsaW5nICE9PSBlbGVtO1xuICAgIH0pO1xuICB9XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgIGZpeEh1Z29PdXRwdXQoKTtcbiAgICBsZXQgeyBpc0RhcmtUaGVtZSwgdGhlbWVNb2RlIH0gPSBpbml0VGhlbWVWYXJpYXRpb24oKTtcbiAgICByZW5kZXJUaGVtZVZhcmlhdGlvbihpc0RhcmtUaGVtZSwgdGhlbWVNb2RlLCB0cnVlKTtcbiAgICBsZXQgY2hpbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRvY3MtbGlua3MgLmFjdGl2ZVwiKTtcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb2NzLWxpbmtzXCIpO1xuICAgIGlmIChjaGlsZCAmJiBwYXJlbnQpIHtcbiAgICAgIHNjcm9sbFBhcmVudFRvQ2hpbGQocGFyZW50LCBjaGlsZCk7XG4gICAgfVxuICAgIGxldCBnaXRodWJSZWxlYXNlU2VsZWN0b3IgPSBcIi5qcy1naXRodWItcmVsZWFzZVwiO1xuICAgIGlmICgkKGdpdGh1YlJlbGVhc2VTZWxlY3RvcikubGVuZ3RoID4gMCkge1xuICAgICAgcHJpbnRMYXRlc3RSZWxlYXNlKGdpdGh1YlJlbGVhc2VTZWxlY3RvciwgJChnaXRodWJSZWxlYXNlU2VsZWN0b3IpLmRhdGEoXCJyZXBvXCIpKTtcbiAgICB9XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgZml4U2Nyb2xsc3B5KCk7XG4gICAgbGV0IGlzb3RvcGVJbnN0YW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnByb2plY3RzLWNvbnRhaW5lclwiKTtcbiAgICBsZXQgaXNvdG9wZUluc3RhbmNlc0NvdW50ID0gaXNvdG9wZUluc3RhbmNlcy5sZW5ndGg7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIGlzb3RvcGVJbnN0YW5jZXNDb3VudCA9PT0gMCkge1xuICAgICAgc2Nyb2xsVG9BbmNob3IoZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSwgMCk7XG4gICAgfVxuICAgIGxldCBjaGlsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9jcy10b2MgLm5hdi1saW5rLmFjdGl2ZVwiKTtcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb2NzLXRvY1wiKTtcbiAgICBpZiAoY2hpbGQgJiYgcGFyZW50KSB7XG4gICAgICBzY3JvbGxQYXJlbnRUb0NoaWxkKHBhcmVudCwgY2hpbGQpO1xuICAgIH1cbiAgICBsZXQgem9vbU9wdGlvbnMgPSB7fTtcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJkYXJrXCIpKSB7XG4gICAgICB6b29tT3B0aW9ucy5iYWNrZ3JvdW5kID0gXCJyZ2JhKDAsMCwwLDAuOSlcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgem9vbU9wdGlvbnMuYmFja2dyb3VuZCA9IFwicmdiYSgyNTUsMjU1LDI1NSwwLjkpXCI7XG4gICAgfVxuICAgIG1lZGl1bV96b29tX2VzbV9kZWZhdWx0KFwiW2RhdGEtem9vbWFibGVdXCIsIHpvb21PcHRpb25zKTtcbiAgICBsZXQgaXNvdG9wZUNvdW50ZXIgPSAwO1xuICAgIGlzb3RvcGVJbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihpc290b3BlSW5zdGFuY2UsIGluZGV4KSB7XG4gICAgICBjb25zb2xlLmRlYnVnKGBMb2FkaW5nIElzb3RvcGUgaW5zdGFuY2UgJHtpbmRleH1gKTtcbiAgICAgIGxldCBpc287XG4gICAgICBsZXQgaXNvU2VjdGlvbiA9IGlzb3RvcGVJbnN0YW5jZS5jbG9zZXN0KFwic2VjdGlvblwiKTtcbiAgICAgIGxldCBsYXlvdXQgPSBcIlwiO1xuICAgICAgaWYgKGlzb1NlY3Rpb24ucXVlcnlTZWxlY3RvcihcIi5pc290b3BlXCIpLmNsYXNzTGlzdC5jb250YWlucyhcImpzLWxheW91dC1yb3dcIikpIHtcbiAgICAgICAgbGF5b3V0ID0gXCJmaXRSb3dzXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXlvdXQgPSBcIm1hc29ucnlcIjtcbiAgICAgIH1cbiAgICAgIGxldCBkZWZhdWx0RmlsdGVyID0gaXNvU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmRlZmF1bHQtcHJvamVjdC1maWx0ZXJcIik7XG4gICAgICBsZXQgZmlsdGVyVGV4dCA9IFwiKlwiO1xuICAgICAgaWYgKGRlZmF1bHRGaWx0ZXIgIT09IG51bGwpIHtcbiAgICAgICAgZmlsdGVyVGV4dCA9IGRlZmF1bHRGaWx0ZXIudGV4dENvbnRlbnQ7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmRlYnVnKGBEZWZhdWx0IElzb3RvcGUgZmlsdGVyOiAke2ZpbHRlclRleHR9YCk7XG4gICAgICBpbWFnZXNMb2FkZWQoaXNvdG9wZUluc3RhbmNlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXNvID0gbmV3IElzb3RvcGUoaXNvdG9wZUluc3RhbmNlLCB7XG4gICAgICAgICAgaXRlbVNlbGVjdG9yOiBcIi5pc290b3BlLWl0ZW1cIixcbiAgICAgICAgICBsYXlvdXRNb2RlOiBsYXlvdXQsXG4gICAgICAgICAgbWFzb25yeToge1xuICAgICAgICAgICAgZ3V0dGVyOiAyMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlsdGVyOiBmaWx0ZXJUZXh0XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgaXNvRmlsdGVyQnV0dG9ucyA9IGlzb1NlY3Rpb24ucXVlcnlTZWxlY3RvckFsbChcIi5wcm9qZWN0LWZpbHRlcnMgYVwiKTtcbiAgICAgICAgaXNvRmlsdGVyQnV0dG9ucy5mb3JFYWNoKFxuICAgICAgICAgIChidXR0b24pID0+IGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBzZWxlY3RvciA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpbHRlclwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYFVwZGF0aW5nIElzb3RvcGUgZmlsdGVyIHRvICR7c2VsZWN0b3J9YCk7XG4gICAgICAgICAgICBpc28uYXJyYW5nZSh7IGZpbHRlcjogc2VsZWN0b3IgfSk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvblNpYmxpbmdzID0gZ2V0U2libGluZ3MoYnV0dG9uKTtcbiAgICAgICAgICAgIGJ1dHRvblNpYmxpbmdzLmZvckVhY2goKGJ1dHRvblNpYmxpbmcpID0+IHtcbiAgICAgICAgICAgICAgYnV0dG9uU2libGluZy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICBidXR0b25TaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJhbGxcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBpbmNyZW1lbnRJc290b3BlQ291bnRlcigpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gaW5jcmVtZW50SXNvdG9wZUNvdW50ZXIoKSB7XG4gICAgICBpc290b3BlQ291bnRlcisrO1xuICAgICAgaWYgKGlzb3RvcGVDb3VudGVyID09PSBpc290b3BlSW5zdGFuY2VzQ291bnQpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgQWxsIFBvcnRmb2xpbyBJc290b3BlIGluc3RhbmNlcyBsb2FkZWQuYCk7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgICAgICAgIHNjcm9sbFRvQW5jaG9yKGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCksIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5jb2RlID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgIGNvbnN0IGJvZHkyID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgaWYgKGJvZHkyLmNsYXNzTGlzdC5jb250YWlucyhcInNlYXJjaGluZ1wiKSkge1xuICAgICAgICAgIHRvZ2dsZVNlYXJjaERpYWxvZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSBcIi9cIikge1xuICAgICAgICBsZXQgZm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5oYXNGb2N1cygpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmJvZHkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgfHwgbnVsbDtcbiAgICAgICAgbGV0IGlzSW5wdXRGb2N1c2VkID0gZm9jdXNlZEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50IHx8IGZvY3VzZWRFbGVtZW50IGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICAgICAgaWYgKHNlYXJjaEVuYWJsZWQgJiYgIWlzSW5wdXRGb2N1c2VkKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0b2dnbGVTZWFyY2hEaWFsb2coKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzZWFyY2hFbmFibGVkKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmpzLXNlYXJjaFwiKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRvZ2dsZVNlYXJjaERpYWxvZygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICB9KTtcbiAgdmFyIGxpbmtMaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanMtc2V0LXRoZW1lLWxpZ2h0XCIpO1xuICB2YXIgbGlua0RhcmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmpzLXNldC10aGVtZS1kYXJrXCIpO1xuICB2YXIgbGlua0F1dG8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmpzLXNldC10aGVtZS1hdXRvXCIpO1xuICBpZiAobGlua0xpZ2h0ICYmIGxpbmtEYXJrICYmIGxpbmtBdXRvKSB7XG4gICAgbGlua0xpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjaGFuZ2VUaGVtZU1vZGVDbGljaygwKTtcbiAgICB9KTtcbiAgICBsaW5rRGFyay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY2hhbmdlVGhlbWVNb2RlQ2xpY2soMSk7XG4gICAgfSk7XG4gICAgbGlua0F1dG8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNoYW5nZVRoZW1lTW9kZUNsaWNrKDIpO1xuICAgIH0pO1xuICB9XG4gIHZhciBkYXJrTW9kZU1lZGlhUXVlcnkgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIik7XG4gIGRhcmtNb2RlTWVkaWFRdWVyeS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xuICAgIG9uTWVkaWFRdWVyeUxpc3RFdmVudChldmVudCk7XG4gIH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwicHJlID4gY29kZVwiKS5mb3JFYWNoKChjb2RlYmxvY2spID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBjb2RlYmxvY2sucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGxldCBjbGFzc2VzVG9BZGQgPSBbXCJidG5cIiwgXCJidG4tcHJpbWFyeVwiLCBcImJ0bi1jb3B5LWNvZGVcIl07XG4gICAgY29weUJ0bi5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXNUb0FkZCk7XG4gICAgY29weUJ0bi5pbm5lckhUTUwgPSBpMThuW1wiY29weVwiXTtcbiAgICBmdW5jdGlvbiBjb3BpZWROb3RpZmljYXRpb24oKSB7XG4gICAgICBjb3B5QnRuLmlubmVySFRNTCA9IGkxOG5bXCJjb3BpZWRcIl07XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29weUJ0bi5pbm5lckhUTUwgPSBpMThuW1wiY29weVwiXTtcbiAgICAgIH0sIDJlMyk7XG4gICAgfVxuICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnNvbGUuZGVidWcoXCJDb2RlIGJsb2NrIGNvcHkgY2xpY2suIElzIHNlY3VyZSBjb250ZXh0IGZvciBDbGlwYm9hcmQgQVBJPyBcIiArIHdpbmRvdy5pc1NlY3VyZUNvbnRleHQpO1xuICAgICAgaWYgKFwiY2xpcGJvYXJkXCIgaW4gbmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGNvZGVibG9jay50ZXh0Q29udGVudCk7XG4gICAgICAgIGNvcGllZE5vdGlmaWNhdGlvbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiRmFsbGluZyBiYWNrIHRvIGxlZ2FjeSBjbGlwYm9hcmQgY29weVwiKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoY29kZWJsb2NrKTtcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJjb3B5XCIpO1xuICAgICAgICAgIGNvcGllZE5vdGlmaWNhdGlvbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxlY3Rpb24ucmVtb3ZlUmFuZ2UocmFuZ2UpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChjb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlnaGxpZ2h0XCIpKSB7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29weUJ0bik7XG4gICAgfSBlbHNlIGlmIChjb2RlYmxvY2sucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLm5vZGVOYW1lID09IFwiVEFCTEVcIikge1xuICAgICAgY29kZWJsb2NrLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChjb3B5QnRuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29kZWJsb2NrLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoY29weUJ0bik7XG4gICAgfVxuICB9KTtcbn0pKCk7XG4vKiEgbWVkaXVtLXpvb20gMS4wLjggfCBNSVQgTGljZW5zZSB8IGh0dHBzOi8vZ2l0aHViLmNvbS9mcmFuY29pc2NoYWxpZm91ci9tZWRpdW0tem9vbSAqL1xuXG47XG4oKCkgPT4ge1xuICAvLyBucy1wYXJhbXM6QHBhcmFtc1xuICB2YXIgY29udGVudF90eXBlID0geyBhdXRob3JzOiBcIkF1dGhvcnNcIiwgZXZlbnQ6IFwiRXZlbnRzXCIsIHBvc3Q6IFwiUG9zdHNcIiwgcHJvamVjdDogXCJQcm9qZWN0c1wiLCBwdWJsaWNhdGlvbjogXCJQdWJsaWNhdGlvbnNcIiwgc2xpZGVzOiBcIlNsaWRlc1wiIH07XG4gIHZhciBpMThuID0geyBub19yZXN1bHRzOiBcIk5vIHJlc3VsdHMgZm91bmRcIiwgcGxhY2Vob2xkZXI6IFwiU2VhcmNoLi4uXCIsIHJlc3VsdHM6IFwicmVzdWx0cyBmb3VuZFwiIH07XG4gIHZhciBzZWFyY2hfY29uZmlnID0geyBpbmRleFVSSTogXCIvaW5kZXguanNvblwiLCBtaW5MZW5ndGg6IDEsIHRocmVzaG9sZDogMC4zIH07XG5cbiAgLy8gPHN0ZGluPlxuICB2YXIgZnVzZU9wdGlvbnMgPSB7XG4gICAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgICBpbmNsdWRlTWF0Y2hlczogdHJ1ZSxcbiAgICB0b2tlbml6ZTogdHJ1ZSxcbiAgICB0aHJlc2hvbGQ6IHNlYXJjaF9jb25maWcudGhyZXNob2xkLFxuICAgIC8vIFNldCB0byB+MC4zIGZvciBwYXJzaW5nIGRpYWNyaXRpY3MgYW5kIENKSyBsYW5ndWFnZXMuXG4gICAgbG9jYXRpb246IDAsXG4gICAgZGlzdGFuY2U6IDEwMCxcbiAgICBtYXhQYXR0ZXJuTGVuZ3RoOiAzMixcbiAgICBtaW5NYXRjaENoYXJMZW5ndGg6IHNlYXJjaF9jb25maWcubWluTGVuZ3RoLFxuICAgIC8vIFNldCB0byAxIGZvciBwYXJzaW5nIENKSyBsYW5ndWFnZXMuXG4gICAga2V5czogW1xuICAgICAgeyBuYW1lOiBcInRpdGxlXCIsIHdlaWdodDogMC45OSB9LFxuICAgICAgeyBuYW1lOiBcInN1bW1hcnlcIiwgd2VpZ2h0OiAwLjYgfSxcbiAgICAgIHsgbmFtZTogXCJhdXRob3JzXCIsIHdlaWdodDogMC41IH0sXG4gICAgICB7IG5hbWU6IFwiY29udGVudFwiLCB3ZWlnaHQ6IDAuMiB9LFxuICAgICAgeyBuYW1lOiBcInRhZ3NcIiwgd2VpZ2h0OiAwLjUgfSxcbiAgICAgIHsgbmFtZTogXCJjYXRlZ29yaWVzXCIsIHdlaWdodDogMC41IH1cbiAgICBdXG4gIH07XG4gIHZhciBzdW1tYXJ5TGVuZ3RoID0gNjA7XG4gIGZ1bmN0aW9uIGdldFNlYXJjaFF1ZXJ5KG5hbWUpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KChsb2NhdGlvbi5zZWFyY2guc3BsaXQobmFtZSArIFwiPVwiKVsxXSB8fCBcIlwiKS5zcGxpdChcIiZcIilbMF0pLnJlcGxhY2UoL1xcKy9nLCBcIiBcIik7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlVVJMKHVybCkge1xuICAgIGlmIChoaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHsgcGF0aDogdXJsIH0sIFwiXCIsIHVybCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGluaXRTZWFyY2goZm9yY2UsIGZ1c2UpIHtcbiAgICBsZXQgcXVlcnkgPSAkKFwiI3NlYXJjaC1xdWVyeVwiKS52YWwoKTtcbiAgICBpZiAocXVlcnkubGVuZ3RoIDwgMSkge1xuICAgICAgJChcIiNzZWFyY2gtaGl0c1wiKS5lbXB0eSgpO1xuICAgICAgJChcIiNzZWFyY2gtY29tbW9uLXF1ZXJpZXNcIikuc2hvdygpO1xuICAgIH1cbiAgICBpZiAoIWZvcmNlICYmIHF1ZXJ5Lmxlbmd0aCA8IGZ1c2VPcHRpb25zLm1pbk1hdGNoQ2hhckxlbmd0aClcbiAgICAgIHJldHVybjtcbiAgICAkKFwiI3NlYXJjaC1oaXRzXCIpLmVtcHR5KCk7XG4gICAgJChcIiNzZWFyY2gtY29tbW9uLXF1ZXJpZXNcIikuaGlkZSgpO1xuICAgIHNlYXJjaEFjYWRlbWljKHF1ZXJ5LCBmdXNlKTtcbiAgICBsZXQgbmV3VVJMID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBcIj9xPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KSArIHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIHVwZGF0ZVVSTChuZXdVUkwpO1xuICB9XG4gIGZ1bmN0aW9uIHNlYXJjaEFjYWRlbWljKHF1ZXJ5LCBmdXNlKSB7XG4gICAgbGV0IHJlc3VsdHMgPSBmdXNlLnNlYXJjaChxdWVyeSk7XG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID4gMCkge1xuICAgICAgJChcIiNzZWFyY2gtaGl0c1wiKS5hcHBlbmQoJzxoMyBjbGFzcz1cIm10LTBcIj4nICsgcmVzdWx0cy5sZW5ndGggKyBcIiBcIiArIGkxOG4ucmVzdWx0cyArIFwiPC9oMz5cIik7XG4gICAgICBwYXJzZVJlc3VsdHMocXVlcnksIHJlc3VsdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKFwiI3NlYXJjaC1oaXRzXCIpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInNlYXJjaC1uby1yZXN1bHRzXCI+JyArIGkxOG4ubm9fcmVzdWx0cyArIFwiPC9kaXY+XCIpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwYXJzZVJlc3VsdHMocXVlcnksIHJlc3VsdHMpIHtcbiAgICAkLmVhY2gocmVzdWx0cywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgbGV0IGNvbnRlbnRfa2V5ID0gdmFsdWUuaXRlbS5zZWN0aW9uO1xuICAgICAgbGV0IGNvbnRlbnQgPSBcIlwiO1xuICAgICAgbGV0IHNuaXBwZXQgPSBcIlwiO1xuICAgICAgbGV0IHNuaXBwZXRIaWdobGlnaHRzID0gW107XG4gICAgICBpZiAoW1wicHVibGljYXRpb25cIiwgXCJldmVudFwiXS5pbmNsdWRlcyhjb250ZW50X2tleSkpIHtcbiAgICAgICAgY29udGVudCA9IHZhbHVlLml0ZW0uc3VtbWFyeTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRlbnQgPSB2YWx1ZS5pdGVtLmNvbnRlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoZnVzZU9wdGlvbnMudG9rZW5pemUpIHtcbiAgICAgICAgc25pcHBldEhpZ2hsaWdodHMucHVzaChxdWVyeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkLmVhY2godmFsdWUubWF0Y2hlcywgZnVuY3Rpb24obWF0Y2hLZXksIG1hdGNoVmFsdWUpIHtcbiAgICAgICAgICBpZiAobWF0Y2hWYWx1ZS5rZXkgPT0gXCJjb250ZW50XCIpIHtcbiAgICAgICAgICAgIGxldCBzdGFydCA9IG1hdGNoVmFsdWUuaW5kaWNlc1swXVswXSAtIHN1bW1hcnlMZW5ndGggPiAwID8gbWF0Y2hWYWx1ZS5pbmRpY2VzWzBdWzBdIC0gc3VtbWFyeUxlbmd0aCA6IDA7XG4gICAgICAgICAgICBsZXQgZW5kID0gbWF0Y2hWYWx1ZS5pbmRpY2VzWzBdWzFdICsgc3VtbWFyeUxlbmd0aCA8IGNvbnRlbnQubGVuZ3RoID8gbWF0Y2hWYWx1ZS5pbmRpY2VzWzBdWzFdICsgc3VtbWFyeUxlbmd0aCA6IGNvbnRlbnQubGVuZ3RoO1xuICAgICAgICAgICAgc25pcHBldCArPSBjb250ZW50LnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICAgICAgICAgIHNuaXBwZXRIaWdobGlnaHRzLnB1c2goXG4gICAgICAgICAgICAgIG1hdGNoVmFsdWUudmFsdWUuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgIG1hdGNoVmFsdWUuaW5kaWNlc1swXVswXSxcbiAgICAgICAgICAgICAgICBtYXRjaFZhbHVlLmluZGljZXNbMF1bMV0gLSBtYXRjaFZhbHVlLmluZGljZXNbMF1bMF0gKyAxXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzbmlwcGV0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgc25pcHBldCArPSB2YWx1ZS5pdGVtLnN1bW1hcnk7XG4gICAgICB9XG4gICAgICBsZXQgdGVtcGxhdGUgPSAkKFwiI3NlYXJjaC1oaXQtZnVzZS10ZW1wbGF0ZVwiKS5odG1sKCk7XG4gICAgICBpZiAoY29udGVudF9rZXkgaW4gY29udGVudF90eXBlKSB7XG4gICAgICAgIGNvbnRlbnRfa2V5ID0gY29udGVudF90eXBlW2NvbnRlbnRfa2V5XTtcbiAgICAgIH1cbiAgICAgIGxldCB0ZW1wbGF0ZURhdGEgPSB7XG4gICAgICAgIGtleSxcbiAgICAgICAgdGl0bGU6IHZhbHVlLml0ZW0udGl0bGUsXG4gICAgICAgIHR5cGU6IGNvbnRlbnRfa2V5LFxuICAgICAgICByZWxwZXJtYWxpbms6IHZhbHVlLml0ZW0ucmVscGVybWFsaW5rLFxuICAgICAgICBzbmlwcGV0XG4gICAgICB9O1xuICAgICAgbGV0IG91dHB1dCA9IHJlbmRlcih0ZW1wbGF0ZSwgdGVtcGxhdGVEYXRhKTtcbiAgICAgICQoXCIjc2VhcmNoLWhpdHNcIikuYXBwZW5kKG91dHB1dCk7XG4gICAgICAkLmVhY2goc25pcHBldEhpZ2hsaWdodHMsIGZ1bmN0aW9uKGhsS2V5LCBobFZhbHVlKSB7XG4gICAgICAgICQoXCIjc3VtbWFyeS1cIiArIGtleSkubWFyayhobFZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHJlbmRlcih0ZW1wbGF0ZSwgZGF0YSkge1xuICAgIGxldCBrZXksIGZpbmQsIHJlO1xuICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgIGZpbmQgPSBcIlxcXFx7XFxcXHtcXFxccypcIiArIGtleSArIFwiXFxcXHMqXFxcXH1cXFxcfVwiO1xuICAgICAgcmUgPSBuZXcgUmVnRXhwKGZpbmQsIFwiZ1wiKTtcbiAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShyZSwgZGF0YVtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG4gIGlmICh0eXBlb2YgRnVzZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgJC5nZXRKU09OKHNlYXJjaF9jb25maWcuaW5kZXhVUkksIGZ1bmN0aW9uKHNlYXJjaF9pbmRleCkge1xuICAgICAgbGV0IGZ1c2UgPSBuZXcgRnVzZShzZWFyY2hfaW5kZXgsIGZ1c2VPcHRpb25zKTtcbiAgICAgIGxldCBxdWVyeSA9IGdldFNlYXJjaFF1ZXJ5KFwicVwiKTtcbiAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5jbGFzc0xpc3QuYWRkKFwic2VhcmNoaW5nXCIpO1xuICAgICAgICAkKFwiLnNlYXJjaC1yZXN1bHRzXCIpLmNzcyh7IG9wYWNpdHk6IDAsIHZpc2liaWxpdHk6IFwidmlzaWJsZVwiIH0pLmFuaW1hdGUoeyBvcGFjaXR5OiAxIH0sIDIwMCk7XG4gICAgICAgICQoXCIjc2VhcmNoLXF1ZXJ5XCIpLnZhbChxdWVyeSk7XG4gICAgICAgICQoXCIjc2VhcmNoLXF1ZXJ5XCIpLmZvY3VzKCk7XG4gICAgICAgIGluaXRTZWFyY2godHJ1ZSwgZnVzZSk7XG4gICAgICB9XG4gICAgICAkKFwiI3NlYXJjaC1xdWVyeVwiKS5rZXl1cChmdW5jdGlvbihlKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCgkLmRhdGEodGhpcywgXCJzZWFyY2hUaW1lclwiKSk7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICBpbml0U2VhcmNoKHRydWUsIGZ1c2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQodGhpcykuZGF0YShcbiAgICAgICAgICAgIFwic2VhcmNoVGltZXJcIixcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGluaXRTZWFyY2goZmFsc2UsIGZ1c2UpO1xuICAgICAgICAgICAgfSwgMjUwKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59KSgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFBQSxHQUFDLE1BQU07QUFFTCxRQUFJLFdBQVcsT0FBTyxVQUFVLFNBQVMsUUFBUTtBQUMvQyxlQUFTLElBQUksR0FBRyxJQUFJLFVBQVUsUUFBUSxLQUFLO0FBQ3pDLFlBQUksU0FBUyxVQUFVLENBQUM7QUFDeEIsaUJBQVMsT0FBTyxRQUFRO0FBQ3RCLGNBQUksT0FBTyxVQUFVLGVBQWUsS0FBSyxRQUFRLEdBQUcsR0FBRztBQUNyRCxtQkFBTyxHQUFHLElBQUksT0FBTyxHQUFHO0FBQUEsVUFDMUI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxjQUFjLFNBQVMsYUFBYSxNQUFNO0FBQzVDLGFBQU8sS0FBSyxZQUFZO0FBQUEsSUFDMUI7QUFDQSxRQUFJLGFBQWEsU0FBUyxZQUFZLFVBQVU7QUFDOUMsYUFBTyxTQUFTLFVBQVUsY0FBYyxRQUFRO0FBQUEsSUFDbEQ7QUFDQSxRQUFJLFNBQVMsU0FBUyxRQUFRLFVBQVU7QUFDdEMsYUFBTyxZQUFZLFNBQVMsYUFBYTtBQUFBLElBQzNDO0FBQ0EsUUFBSSxRQUFRLFNBQVMsT0FBTyxPQUFPO0FBQ2pDLFVBQUksU0FBUyxNQUFNLGNBQWMsTUFBTTtBQUN2QyxhQUFPLE9BQU8sT0FBTyxFQUFFLEVBQUUsWUFBWSxNQUFNO0FBQUEsSUFDN0M7QUFDQSxRQUFJLHdCQUF3QixTQUFTLHVCQUF1QixVQUFVO0FBQ3BFLFVBQUk7QUFDRixZQUFJLE1BQU0sUUFBUSxRQUFRLEdBQUc7QUFDM0IsaUJBQU8sU0FBUyxPQUFPLFdB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
