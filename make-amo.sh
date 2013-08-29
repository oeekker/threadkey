#!/bin/bash
# amo
cd $(dirname $(cygpath -u $(cygpath -m -s "${0}")))/..
[ -d package ] || mkdir package
cd package
[ -d amo ] || mkdir amo
cd amo
rm -fr install.rdf chrome.manifest chrome/ defaults/
cd ..
rsync -a --exclude-from=../code/make-exclude.txt ../code/* amo/
cd amo/chrome
find locale -name amo.html -exec rm \{\} \;
zip -r -D -0 threadkey.jar content/ locale/ skin/
cd ../..
grep em:update -A 2 ../code/install.rdf > make-grep.txt
grep -v -f make-grep.txt ../code/install.rdf | grep -v em:unpack > amo/install.rdf
rm make-grep.txt
sed -r "s/chrome\//jar:chrome\/threadkey.jar!\//" ../code/chrome.manifest > amo/chrome.manifest
version=$(grep em:version ../code/install.rdf | sed -r "s/^[^\"]*\"//" | sed -r "s/\"[^\"]*$//")
cd amo
rm threadkey-${version}-tb+sm.xpi 2> /dev/null
zip -r -D threadkey-${version}-tb+sm.xpi install.rdf chrome.manifest chrome/threadkey.jar defaults/
cd ..
read -p "Press any key to continue . . . " -n 1
