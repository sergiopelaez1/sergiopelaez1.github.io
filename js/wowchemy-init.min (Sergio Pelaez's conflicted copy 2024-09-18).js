/*! Hugo Blox Builder v5.9.7 | https://hugoblox.com/ */
/*! Copyright 2016-present George Cushen (https://georgecushen.com/) */
/*! License: https://github.com/HugoBlox/hugo-blox-builder/blob/main/LICENSE.md */

;
(() => {
  // <stdin>
  (() => {
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
    var wcDarkLightEnabled = "minimal";
    var wcIsSiteThemeDark = false;
    window.wc = {
      darkLightEnabled: wcDarkLightEnabled,
      isSiteThemeDark: wcIsSiteThemeDark
    };
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on("init", (user) => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
    initThemeVariation();
    window.PlotlyConfig = { MathJaxConfig: "local" };
    Object.keys(localStorage).forEach(function(key) {
      if (/^wc-announcement-/.test(key)) {
        document.documentElement.setAttribute("data-wc-announcement-status", "dismissed");
        console.debug("Hiding announcement...");
      }
    });
  })();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiPHN0ZGluPiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiKCgpID0+IHtcbiAgLy8gbnMtaHVnbzpDOlxcVXNlcnNcXHNwZWxhZXozXFxHYVRlY2ggRHJvcGJveFxcU2VyZ2lvIFBlbGFlelxcSm9iIEFwcGxpY2F0aW9uXFxBY2FkZW1pY1xcd2Vic2l0ZVxcdGhlbWVzXFxnaXRodWIuY29tXFxIdWdvQmxveFxcaHVnby1ibG94LWJ1aWxkZXJcXG1vZHVsZXNcXGJsb3gtYm9vdHN0cmFwXFx2NVxcYXNzZXRzXFxqc1xcd293Y2hlbXktdGhlbWluZy5qc1xuICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGZ1bmN0aW9uIGdldFRoZW1lTW9kZSgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ3Y1RoZW1lXCIpIHx8IDIpO1xuICB9XG4gIGZ1bmN0aW9uIGNhbkNoYW5nZVRoZW1lKCkge1xuICAgIHJldHVybiBCb29sZWFuKHdpbmRvdy53Yy5kYXJrTGlnaHRFbmFibGVkKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0VGhlbWVWYXJpYXRpb24oKSB7XG4gICAgaWYgKCFjYW5DaGFuZ2VUaGVtZSgpKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFwiVXNlciB0aGVtaW5nIGRpc2FibGVkLlwiKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzRGFya1RoZW1lOiB3aW5kb3cud2MuaXNTaXRlVGhlbWVEYXJrLFxuICAgICAgICB0aGVtZU1vZGU6IHdpbmRvdy53Yy5pc1NpdGVUaGVtZURhcmsgPyAxIDogMFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1ZyhcIlVzZXIgdGhlbWluZyBlbmFibGVkLlwiKTtcbiAgICBsZXQgaXNEYXJrVGhlbWU7XG4gICAgbGV0IGN1cnJlbnRUaGVtZU1vZGUgPSBnZXRUaGVtZU1vZGUoKTtcbiAgICBjb25zb2xlLmRlYnVnKGBVc2VyJ3MgdGhlbWUgdmFyaWF0aW9uOiAke2N1cnJlbnRUaGVtZU1vZGV9YCk7XG4gICAgc3dpdGNoIChjdXJyZW50VGhlbWVNb2RlKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGlzRGFya1RoZW1lID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpc0RhcmtUaGVtZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKS5tYXRjaGVzKSB7XG4gICAgICAgICAgaXNEYXJrVGhlbWUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodClcIikubWF0Y2hlcykge1xuICAgICAgICAgIGlzRGFya1RoZW1lID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNEYXJrVGhlbWUgPSB3aW5kb3cud2MuaXNTaXRlVGhlbWVEYXJrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoaXNEYXJrVGhlbWUgJiYgIWJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGFya1wiKSkge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIkFwcGx5aW5nIEh1Z28gQmxveCBCdWlsZGVyIGRhcmsgdGhlbWVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJkYXJrXCIpO1xuICAgIH0gZWxzZSBpZiAoIWlzRGFya1RoZW1lICYmIGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGFya1wiKSkge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIkFwcGx5aW5nIEh1Z28gQmxveCBCdWlsZGVyIGxpZ2h0IHRoZW1lXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiZGFya1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzRGFya1RoZW1lLFxuICAgICAgdGhlbWVNb2RlOiBjdXJyZW50VGhlbWVNb2RlXG4gICAgfTtcbiAgfVxuXG4gIC8vIG5zLXBhcmFtczpAcGFyYW1zXG4gIHZhciB3Y0RhcmtMaWdodEVuYWJsZWQgPSBcIm1pbmltYWxcIjtcbiAgdmFyIHdjSXNTaXRlVGhlbWVEYXJrID0gZmFsc2U7XG5cbiAgLy8gPHN0ZGluPlxuICB3aW5kb3cud2MgPSB7XG4gICAgZGFya0xpZ2h0RW5hYmxlZDogd2NEYXJrTGlnaHRFbmFibGVkLFxuICAgIGlzU2l0ZVRoZW1lRGFyazogd2NJc1NpdGVUaGVtZURhcmtcbiAgfTtcbiAgaWYgKHdpbmRvdy5uZXRsaWZ5SWRlbnRpdHkpIHtcbiAgICB3aW5kb3cubmV0bGlmeUlkZW50aXR5Lm9uKFwiaW5pdFwiLCAodXNlcikgPT4ge1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHdpbmRvdy5uZXRsaWZ5SWRlbnRpdHkub24oXCJsb2dpblwiLCAoKSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IFwiL2FkbWluL1wiO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpbml0VGhlbWVWYXJpYXRpb24oKTtcbiAgd2luZG93LlBsb3RseUNvbmZpZyA9IHsgTWF0aEpheENvbmZpZzogXCJsb2NhbFwiIH07XG4gIE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoL153Yy1hbm5vdW5jZW1lbnQtLy50ZXN0KGtleSkpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdjLWFubm91bmNlbWVudC1zdGF0dXNcIiwgXCJkaXNtaXNzZWRcIik7XG4gICAgICBjb25zb2xlLmRlYnVnKFwiSGlkaW5nIGFubm91bmNlbWVudC4uLlwiKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQUEsR0FBQyxNQUFNO0FBRUwsUUFBSSxPQUFPLFNBQVM7QUFDcEIsYUFBUyxlQUFlO0FBQ3RCLGFBQU8sU0FBUyxhQUFhLFFBQVEsU0FBUyxLQUFLLENBQUM7QUFBQSxJQUN0RDtBQUNBLGFBQVMsaUJBQWlCO0FBQ3hCLGFBQU8sUUFBUSxPQUFPLEdBQUcsZ0JBQWdCO0FBQUEsSUFDM0M7QUFDQSxhQUFTLHFCQUFxQjtBQUM1QixVQUFJLENBQUMsZUFBZSxHQUFHO0FBQ3JCLGdCQUFRLE1BQU0sd0JBQXdCO0FBQ3RDLGVBQU87QUFBQSxVQUNMLGFBQWEsT0FBTyxHQUFHO0FBQUEsVUFDdkIsV0FBVyxPQUFPLEdBQUcsa0JBQWtCLElBQUk7QUFBQSxRQUM3QztBQUFBLE1BQ0Y7QUFDQSxjQUFRLE1BQU0sdUJBQXVCO0FBQ3JDLFVBQUk7QUFDSixVQUFJLG1CQUFtQixhQUFhO0FBQ3BDLGNBQVEsTUFBTSwyQkFBMkIsZ0JBQWdCLEVBQUU7QUFDM0QsY0FBUSxrQkFBa0I7QUFBQSxRQUN4QixLQUFLO0FBQ0gsd0JBQWM7QUFDZDtBQUFBLFFBQ0YsS0FBSztBQUNILHdCQUFjO0FBQ2Q7QUFBQSxRQUNGO0FBQ0UsY0FBSSxPQUFPLFdBQVcsOEJBQThCLEVBQUUsU0FBUztBQUM3RCwwQkFBYztBQUFBLFVBQ2hCLFdBQVcsT0FBTyxXQUFXLCtCQUErQixFQUFFLFNBQVM7QUFDckUsMEJBQWM7QUFBQSxVQUNoQixPQUFPO0FBQ0wsMEJBQWMsT0FBTyxHQUFHO0FBQUEsVUFDMUI7QUFDQTtBQUFBLE1BQ0o7QUFDQSxVQUFJLGVBQWUsQ0FBQyxLQUFLLFVBQVUsU0FBUyxNQUFNLEdBQUc7QUFDbkQsZ0JBQVEsTUFBTSx1Q0FBdUM7QUFDckQsaUJBQVMsS0FBSyxVQUFVLElBQUksTUFBTTtBQUFBLE1BQ3BDLFdBQVcsQ0FBQyxlQUFlLEtBQUssVUFBVSxTQUFTLE1BQU0sR0FBRztBQUMxRCxnQkFBUSxNQUFNLHdDQUF3QztBQUN0RCxpQkFBUyxLQUFLLFVBQVUsT0FBTyxNQUFNO0FBQUEsTUFDdkM7QUFDQSxhQUFPO0FBQUEsUUFDTDtBQUFBLFFBQ0EsV0FBVztBQUFBLE1BQ2I7QUFBQSxJQUNGO0FBR0EsUUFBSSxxQkFBcUI7QUFDekIsUUFBSSxvQkFBb0I7QUFHeEIsV0FBTyxLQUFLO0FBQUEsTUFDVixrQkFBa0I7QUFBQSxNQUNsQixpQkFBaUI7QUFBQSxJQUNuQjtBQUNBLFFBQUksT0FBTyxpQkFBaUI7QUFDMUIsYUFBTyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsU0FBUztBQUMxQyxZQUFJLENBQUMsTUFBTTtBQUNULGlCQUFPLGdCQUFnQixHQUFHLFNBQVMsTUFBTTtBQUN2QyxxQkFBUyxTQUFTLE9BQU87QUFBQSxVQUMzQixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFDQSx1QkFBbUI7QUFDbkIsV0FBTyxlQUFlLEVBQUUsZUFBZSxRQUFRO0FBQy9DLFdBQU8sS0FBSyxZQUFZLEVBQUUsUUFBUSxTQUFTLEtBQUs7QUFDOUMsVUFBSSxvQkFBb0IsS0FBSyxHQUFHLEdBQUc7QUFDakMsaUJBQVMsZ0JBQWdCLGFBQWEsK0JBQStCLFdBQVc7QUFDaEYsZ0JBQVEsTUFBTSx3QkFBd0I7QUFBQSxNQUN4QztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsR0FBRzsiLAogICJuYW1lcyI6IFtdCn0K
