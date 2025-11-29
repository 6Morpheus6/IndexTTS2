const path = require("path");
const pythonExe = path.join(__dirname, "app", ".venv", "Scripts", "python.exe"); 
const cudaHome = process.env.CONDA_PREFIX
  ? path.join(process.env.CONDA_PREFIX, "Library", "bin")
  : process.env.CUDA_PATH || "";
module.exports = {
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
          "python webui.py --host 127.0.0.1 ",
        ],
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      },
      next: "uri"
    },
    {
      when: "{{gpu === 'nvidia'}}",
      method: "shell.run",
      params: {
        build: true,
        venv: ".venv",
        env: { CUDA_HOME: cudaHome },
        path: "app",
        message: [
          `${pythonExe} -c "import importlib; m=importlib.import_module('indextts.BigVGAN.alias_free_activation.cuda.load'); m.load()"`,
          `${pythonExe} webui.py --host 127.0.0.1 --cuda_kernel`
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
