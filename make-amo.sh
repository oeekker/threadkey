#!/bin/bash
# amo
cd $(dirname $(cygpath -u $(cygpath -m -s "${0}")))/..
[ -d package ] || mkdir package
cd package
rm -fr amo/
rsync -a --exclude-from=../src/make-exclude.txt ../src/* amo/
cd amo/chrome
find locale -name amo.html -exec rm \{\} \;
zip -r -D -0 threadkey.jar content/ locale/ skin/
cd ../..
sed -r "s/chrome\//jar:chrome\/threadkey.jar!\//" ../src/chrome.manifest > amo/chrome.manifest
version=$(grep em:version ../src/install.rdf | sed -r "s/^[^\"]*\"//" | sed -r "s/\"[^\"]*$//")
cd amo
rm threadkey-${version}-tb+sm.xpi 2> /dev/null
zip -r -D threadkey-${version}-tb+sm.xpi install.rdf chrome.manifest chrome/threadkey.jar defaults/
cd ..
read -p "Press any key to continue . . . " -n 1
