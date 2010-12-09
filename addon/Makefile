package : clean
					zip -r antimony.xpi chrome/ defaults/ locale/ chrome.manifest install.rdf

clone : clean
					cp -R . ${DIR}/${NAME} && \
          find ${DIR}/${NAME}/ -not -regex '^\./\.git/.*' -type f | \
          xargs sed -i 's/antimony/${NAME}/g'

clean :
					rm -f antimony.xpi

