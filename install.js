module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "git lfs install",
          "git clone https://github.com/index-tts/index-tts app",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git lfs pull"
      }
    },
    {
      method: "shell.run",
      params: {
        env: {
          CONDA_AUTO_UPDATE_CONDA: "false"
        },
        message: [
          "conda update -y -c conda-forge huggingface_hub",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "uv sync --extra webui",
          'uv tool install "huggingface-hub[cli,hf_xet]"'
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: ".venv",
          path: "app",
          // xformers: true
        }
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "hf download IndexTeam/IndexTTS-2 --local-dir=checkpoints"
      }
    }
  ]
}
