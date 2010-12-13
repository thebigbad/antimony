package : clean
					cd addon/ && zip -r ../antimony.xpi chrome/ defaults/ locale/ chrome.manifest install.rdf

clean :
					rm -f antimony.xpi

