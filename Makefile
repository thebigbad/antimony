package : clean
					cd addon/ && zip -r ../antimony.xpi chrome/ defaults/ locale/ chrome.manifest install.rdf


build : clean
					cp -R addon/* build/ && \
            cp vendor/windex/windex.js build/chrome/modules/ && \
            cp vendor/commonjs-ffext/common.js build/chrome/modules/

clean :
					rm -fr antimony.xpi build/*

