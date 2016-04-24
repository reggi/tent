npm build my-module@1.0.0
npm build my-module
npm from my-builder@1.0.0
npm from my-builder
npm from {"build-module@1.0.0": "module-string-argument"}
npm from {"build-module": "module-string-argument"}
npm build ["build-module-one", "build-module-two"]
npm build my-module@1.0.0 from my-builder@1.0.0
npm build my-module@1.0.0 from my-builder@1.0.0
npm build my-module@1.0.0 from ["my-builder@1.0.0"]
npm build my-module@1.0.0 from {"my-builder@1.0.0": "hi"}
npm my-module@1.0.0 my-builder@1.0.0
npm my-module@1.0.0 from my-builder@1.0.0
