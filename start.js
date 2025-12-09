module.exports = {
  requires: {
    bundle: "ai",
  },
  daemon: true,
  run: [
    {
      when: "{{gpu !== 'nvidia'}}",
      method: "shell.run",
      params: {
        venv: ".venv",
        env: { },
        path: "app",
        message: [
          "python webui.py --host 127.0.0.1",
        ],
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      },
      next: "uri"
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "shell.run",
      params: {
        build: true,
        venv: ".venv",
        env: { },
        path: "app",
        message: [
          ".venv\\Scripts\\python.exe webui.py --host 127.0.0.1 --cuda_kernel"
        ],
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      },
      next: "uri"
    },
    {
      when: "{{platform === 'linux' && gpu === 'nvidia'}}",
      method: "shell.run",
      params: {
        build: true,
        venv: ".venv",
        env: { },
        path: "app",
        message: [
          "python webui.py --host 127.0.0.1"
        ],
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      },
      next: "uri"
    },
    {
      id: "uri",
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
      }
    }
  ]
}
