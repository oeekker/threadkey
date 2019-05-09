#!/bin/bash
# atn
if [ "$(uname)" == "Linux" ]
then
  cd $(dirname .)/..
else
  cd $(dirname $(cygpath -u $(cygpath -m -s "${0}")))/..
fi
[ -d package ] || mkdir package
cd package
rm -r *
rsync -a ../code/* ./
version=$(grep em:version install.rdf | sed -r "s/^[^>]*>//" | sed -r "s/<.*$//")
rm threadkey-${version}-tb+sm.xpi 2> /dev/null
zip -r -D threadkey-${version}-tb+sm.xpi manifest.json install.rdf chrome.manifest icon.png bootstrap.js defaults/ chrome/locale/en-US/* $(find chrome/locale -type f | sort) -x \*atn.properties
