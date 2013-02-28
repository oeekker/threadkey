#!/bin/bash
# babelzilla
cd $(dirname $(cygpath -u $(cygpath -m -s "${0}")))/..
[ -d package ] || mkdir package
cd package
rm -fr babelzilla/
rsync -a --exclude-from=../src/make-exclude.txt ../src/* babelzilla/
version=$(grep em:version ../src/install.rdf | sed -r "s/^[^\"]*\"//" | sed -r "s/\"[^\"]*$//")
cd babelzilla
rm threadkey-${version}-tb+sm.xpi 2> /dev/null
zip -r -D threadkey-${version}-tb+sm.xpi install.rdf chrome.manifest chrome/ defaults/
cd ..
read -p "Press any key to continue . . . " -n 1