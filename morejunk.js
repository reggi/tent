


// 'tent build my-module@1.0.0', {'type': 'BUILD_DECLARATION', 'build': 'my-module@1.0.0', 'rootSyntax': 'tent'}
// 'tent build my-module', {'type': 'BUILD_DECLARATION', 'build': 'my-module', 'rootSyntax': 'tent'}
// 'tent from my-builder@1.0.0', {'type': 'FOUNDATION_DECLARATION', 'foundation': 'my-builder@1.0.0', 'root': 'tent'}
// 'tent foundataion my-builder', {'type': 'FOUNDATION_DECLARATION', 'foundation': 'my-builder', 'root': 'tent'}
// 'tent build ["build-module-one", "build-module-two"]', {'type': 'BUILD_DECLARATION', 'foundation': '["build-module-one", "build-module-two"]', 'root': 'tent'}
// 'tent build my-module@1.0.0 from my-builder@1.0.0', {'type': 'BUILD_FOUNDATION_DECLARATION','build': 'my-module@1.0.0','foundation': 'my-builder@1.0.0', 'root': 'tent'}
// 'tent my-module@1.0.0 my-builder@1.0.0', {'type': 'BUILD_FOUNDATION_DECLARATION','build': 'my-module@1.0.0','foundation': 'my-builder@1.0.0', 'root': 'tent'}
