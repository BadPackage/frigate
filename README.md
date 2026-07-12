# Frigate NVR (fork)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A personal fork of [Frigate](https://github.com/blakeblackshear/frigate) — a complete and local NVR with realtime AI object detection for IP cameras. It uses OpenCV and TensorFlow/ONNX to perform object detection locally, with an emphasis on minimal resource usage and realtime performance.

Use of a GPU or AI accelerator is highly recommended. See the upstream [object detectors](https://docs.frigate.video/configuration/object_detectors/) docs.

## Fork notes

- **Frigate+ removed.** All Frigate+ cloud functionality (model submission, snapshot/false-positive upload, hosted model download via `plus://`, and the related UI/API/config) has been stripped out. This fork runs entirely on local and custom models.
- **Newer dependencies.** Python and npm dependencies are kept more up to date than upstream, and CUDA has been upgraded (CUDA 13). Compatibility with older setups is not a priority; images are built locally.
- **Rust migration planned.** The backend is being migrated away from Python. Expect the `frigate/` Python tree to be progressively replaced.

## Features

- Designed to minimize resource use by only running object detection when and where it is necessary
- Low-overhead motion detection to decide where to run object detection
- Object detection runs in separate processes for maximum FPS
- Communicates over MQTT for easy integration into other systems
- Records video with object-based retention settings, plus 24/7 recording
- Re-streaming via RTSP and WebRTC/MSE for low-latency live view

## Documentation

Upstream documentation: https://docs.frigate.video

## License

This project is licensed under the [MIT License](LICENSE). It is derived from the upstream Frigate project. The "Frigate" name and logo are trademarks of Frigate, Inc. and are not covered by the MIT License.
