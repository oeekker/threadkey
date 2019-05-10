#!/bin/bash
version=$(grep em:version install.rdf | sed -r "s/^[^>]*>//" | sed -r "s/<.*$//")
rm threadkey-${version}-tb+sm.xpi 2> /dev/null
zip -r -D threadkey-${version}-tb+sm.xpi install.rdf chrome.manifest icon.png bootstrap.js defaults/ chrome/locale/en-US/* $(find chrome/locale -type f | sort) -x \*atn.properties
