// vite.config.ts
import { defineConfig } from "file:///Users/scmitton/Documents/Dev/Ledget/front/node_modules/.pnpm/vite@5.1.6_@types+node@18.16.9_sass@1.62.1/node_modules/vite/dist/node/index.js";
import react from "file:///Users/scmitton/Documents/Dev/Ledget/front/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.1.6/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nxViteTsPaths } from "file:///Users/scmitton/Documents/Dev/Ledget/front/node_modules/.pnpm/@nx+vite@18.0.2_@swc-node+register@1.6.8_@swc+core@1.3.107_@types+node@18.16.9_nx@18.0.2_type_5syyd3f2ao4uqmpmn4geq5be5y/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js";
import path from "path";
import fs from "fs";
import { visualizer } from "file:///Users/scmitton/Documents/Dev/Ledget/front/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "/Users/scmitton/Documents/Dev/Ledget/front/apps/webhome";
var certsDir = __vite_injected_original_dirname + "/../../certs/";
var vite_config_default = defineConfig({
  cacheDir: "../../node_modules/.vite/webhome",
  ...process.env.NODE_ENV === "development" ? {
    server: {
      watch: {
        usePolling: true,
        interval: 100
      },
      port: 3e3,
      host: "localhost",
      strictPort: true,
      https: {
        key: fs.existsSync(certsDir + "localhost.key") ? fs.readFileSync(certsDir + "localhost.key") : "",
        cert: fs.existsSync(certsDir + "localhost.crt") ? fs.readFileSync(certsDir + "localhost.crt") : "",
        ca: fs.existsSync(certsDir + "ledgetCA.pem") ? fs.readFileSync(certsDir + "ledgetCA.pem") : ""
      }
    }
  } : {},
  ...process.env.NODE_ENV === "development" ? {
    preview: {
      port: 3300,
      host: "localhost",
      strictPort: true,
      https: {
        key: fs.existsSync(certsDir + "localhost.key") ? fs.readFileSync(certsDir + "localhost.key") : "",
        cert: fs.existsSync(certsDir + "localhost.crt") ? fs.readFileSync(certsDir + "localhost.crt") : "",
        ca: fs.existsSync(certsDir + "ledgetCA.pem") ? fs.readFileSync(certsDir + "ledgetCA.pem") : ""
      }
    }
  } : {},
  plugins: [react(), nxViteTsPaths(), visualizer()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@context": path.resolve(__vite_injected_original_dirname, "./src/context"),
      "@flow": path.resolve(__vite_injected_original_dirname, "./src/flow"),
      "@features": path.resolve(__vite_injected_original_dirname, "./src/features"),
      "@api": path.resolve(__vite_injected_original_dirname, "./src/api"),
      "@pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@modals": path.resolve(__vite_injected_original_dirname, "./src/modals"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@styles": path.resolve(__vite_injected_original_dirname, "./src/styles")
    }
  },
  test: {
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest"
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"]
  },
  build: {
    chunkSizeWarningLimit: 1024 * 1024
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc2NtaXR0b24vRG9jdW1lbnRzL0Rldi9MZWRnZXQvZnJvbnQvYXBwcy93ZWJob21lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc2NtaXR0b24vRG9jdW1lbnRzL0Rldi9MZWRnZXQvZnJvbnQvYXBwcy93ZWJob21lL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zY21pdHRvbi9Eb2N1bWVudHMvRGV2L0xlZGdldC9mcm9udC9hcHBzL3dlYmhvbWUvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgbnhWaXRlVHNQYXRocyB9IGZyb20gJ0BueC92aXRlL3BsdWdpbnMvbngtdHNjb25maWctcGF0aHMucGx1Z2luJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5cbi8vIHJvb3QgZGlyIG9mIG54IG1vbm9yZXBvXG5jb25zdCBjZXJ0c0RpciA9IF9fZGlybmFtZSArICcvLi4vLi4vY2VydHMvJztcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGNhY2hlRGlyOiAnLi4vLi4vbm9kZV9tb2R1bGVzLy52aXRlL3dlYmhvbWUnLFxuXG4gIC4uLihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xuICAgID8ge1xuICAgICAgc2VydmVyOiB7XG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICAgICAgICBpbnRlcnZhbDogMTAwLFxuICAgICAgICB9LFxuICAgICAgICBwb3J0OiAzMDAwLFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgICAgaHR0cHM6IHtcbiAgICAgICAgICBrZXk6IGZzLmV4aXN0c1N5bmMoY2VydHNEaXIgKyAnbG9jYWxob3N0LmtleScpID8gZnMucmVhZEZpbGVTeW5jKGNlcnRzRGlyICsgJ2xvY2FsaG9zdC5rZXknKSA6ICcnLFxuICAgICAgICAgIGNlcnQ6IGZzLmV4aXN0c1N5bmMoY2VydHNEaXIgKyAnbG9jYWxob3N0LmNydCcpID8gZnMucmVhZEZpbGVTeW5jKGNlcnRzRGlyICsgJ2xvY2FsaG9zdC5jcnQnKSA6ICcnLFxuICAgICAgICAgIGNhOiBmcy5leGlzdHNTeW5jKGNlcnRzRGlyICsgJ2xlZGdldENBLnBlbScpID8gZnMucmVhZEZpbGVTeW5jKGNlcnRzRGlyICsgJ2xlZGdldENBLnBlbScpIDogJycsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgOiB7fVxuICApLFxuXG4gIC4uLihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xuICAgID8ge1xuICAgICAgcHJldmlldzoge1xuICAgICAgICBwb3J0OiAzMzAwLFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgICAgaHR0cHM6IHtcbiAgICAgICAgICBrZXk6IGZzLmV4aXN0c1N5bmMoY2VydHNEaXIgKyAnbG9jYWxob3N0LmtleScpID8gZnMucmVhZEZpbGVTeW5jKGNlcnRzRGlyICsgJ2xvY2FsaG9zdC5rZXknKSA6ICcnLFxuICAgICAgICAgIGNlcnQ6IGZzLmV4aXN0c1N5bmMoY2VydHNEaXIgKyAnbG9jYWxob3N0LmNydCcpID8gZnMucmVhZEZpbGVTeW5jKGNlcnRzRGlyICsgJ2xvY2FsaG9zdC5jcnQnKSA6ICcnLFxuICAgICAgICAgIGNhOiBmcy5leGlzdHNTeW5jKGNlcnRzRGlyICsgJ2xlZGdldENBLnBlbScpID8gZnMucmVhZEZpbGVTeW5jKGNlcnRzRGlyICsgJ2xlZGdldENBLnBlbScpIDogJycsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgOiB7fVxuICApLFxuXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBueFZpdGVUc1BhdGhzKCksIHZpc3VhbGl6ZXIoKV0sXG5cbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAdXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICAgICdAY29udGV4dCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb250ZXh0JyksXG4gICAgICAnQGZsb3cnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvZmxvdycpLFxuICAgICAgJ0BmZWF0dXJlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9mZWF0dXJlcycpLFxuICAgICAgJ0BhcGknOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvYXBpJyksXG4gICAgICAnQHBhZ2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BhZ2VzJyksXG4gICAgICAnQG1vZGFscyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9tb2RhbHMnKSxcbiAgICAgICdAaG9va3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaG9va3MnKSxcbiAgICAgICdAc3R5bGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3N0eWxlcycpLFxuICAgIH1cbiAgfSxcblxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBjYWNoZToge1xuICAgICAgZGlyOiAnLi4vLi4vbm9kZV9tb2R1bGVzLy52aXRlc3QnLFxuICAgIH0sXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgaW5jbHVkZTogWydzcmMvKiovKi57dGVzdCxzcGVjfS57anMsbWpzLGNqcyx0cyxtdHMsY3RzLGpzeCx0c3h9J10sXG4gIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMjQgKiAxMDI0LFxuICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sUUFBUTtBQUNmLFNBQVMsa0JBQWtCO0FBTjNCLElBQU0sbUNBQW1DO0FBU3pDLElBQU0sV0FBVyxtQ0FBWTtBQUk3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixVQUFVO0FBQUEsRUFFVixHQUFJLFFBQVEsSUFBSSxhQUFhLGdCQUN6QjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsWUFBWTtBQUFBLFFBQ1osVUFBVTtBQUFBLE1BQ1o7QUFBQSxNQUNBLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE9BQU87QUFBQSxRQUNMLEtBQUssR0FBRyxXQUFXLFdBQVcsZUFBZSxJQUFJLEdBQUcsYUFBYSxXQUFXLGVBQWUsSUFBSTtBQUFBLFFBQy9GLE1BQU0sR0FBRyxXQUFXLFdBQVcsZUFBZSxJQUFJLEdBQUcsYUFBYSxXQUFXLGVBQWUsSUFBSTtBQUFBLFFBQ2hHLElBQUksR0FBRyxXQUFXLFdBQVcsY0FBYyxJQUFJLEdBQUcsYUFBYSxXQUFXLGNBQWMsSUFBSTtBQUFBLE1BQzlGO0FBQUEsSUFDRjtBQUFBLEVBQ0YsSUFDRSxDQUFDO0FBQUEsRUFHTCxHQUFJLFFBQVEsSUFBSSxhQUFhLGdCQUN6QjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osT0FBTztBQUFBLFFBQ0wsS0FBSyxHQUFHLFdBQVcsV0FBVyxlQUFlLElBQUksR0FBRyxhQUFhLFdBQVcsZUFBZSxJQUFJO0FBQUEsUUFDL0YsTUFBTSxHQUFHLFdBQVcsV0FBVyxlQUFlLElBQUksR0FBRyxhQUFhLFdBQVcsZUFBZSxJQUFJO0FBQUEsUUFDaEcsSUFBSSxHQUFHLFdBQVcsV0FBVyxjQUFjLElBQUksR0FBRyxhQUFhLFdBQVcsY0FBYyxJQUFJO0FBQUEsTUFDOUY7QUFBQSxJQUNGO0FBQUEsRUFDRixJQUNFLENBQUM7QUFBQSxFQUdMLFNBQVMsQ0FBQyxNQUFNLEdBQUcsY0FBYyxHQUFHLFdBQVcsQ0FBQztBQUFBLEVBRWhELFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxlQUFlLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUN6RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsWUFBWSxLQUFLLFFBQVEsa0NBQVcsZUFBZTtBQUFBLE1BQ25ELFNBQVMsS0FBSyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUM3QyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxNQUNyRCxRQUFRLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsTUFDM0MsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQy9DLFdBQVcsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUNqRCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBLElBQ1A7QUFBQSxJQUNBLGFBQWE7QUFBQSxJQUNiLFNBQVMsQ0FBQyxzREFBc0Q7QUFBQSxFQUNsRTtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsdUJBQXVCLE9BQU87QUFBQSxFQUNoQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
