#!/bin/bash
if [ "$(uname)" == "Linux" ]
then
  SRC=$(basename "$(dirname "$(readlink -f "${0}")")")
  cd $(dirname .)/..
else
  SRC=$(basename "$(dirname "$(cygpath -u $(cygpath -m -s "${0}"))")")
  cd $(dirname $(cygpath -u $(cygpath -m -s "${0}")))/..
fi
[ ! -d package ] || rm -r package
mkdir package
cd package
rsync -a ../${SRC}/* .
cd chrome/locale
for LOCALE in *
do
  echo -n -e "     \r${LOCALE}"
  FILE=${LOCALE}/install.properties
  NAME=$(grep "\.name=" ${FILE} | sed -e "s/^.*\.name=//" | sed -e "s/\"/\\\\\\\\\"/g" -e "s/\&nbsp;/ /g" -e "s/\&/\\\\\&/g" -e "s/\//\\\\\//g")
  DESCRIPTION=$(grep "\.description=" ${FILE} | sed -e "s/^.*\.description=//" | sed -e "s/\"/\\\\\\\\\"/g" -e "s/\&nbsp;/ /g" -e "s/\&/\\\\\&/g" -e "s/\//\\\\\//g")
  mkdir ../../_locales/${LOCALE}
  cat ../../_locales/en/messages.json | sed -e "s/\"ThreadKey\"/\"${NAME}\"/" -e "s/\"Strike.*view.\"/\"${DESCRIPTION}\"/" > ../../_locales/${LOCALE}/messages.json
  touch -r ${FILE} ../../_locales/${LOCALE} ../../_locales/${LOCALE}/messages.json
done
echo -n -e "     \r"
cd ../..
version=$(grep em:version install.rdf | sed -r "s/^[^>]*>//" | sed -r "s/<.*$//")
cp -p manifest.json manifest.tmp
cat manifest.tmp | sed -e "s/\"version\": \".*\"/\"version\": \"${version}\"/" > manifest.json
touch -r manifest.tmp manifest.json
rm manifest.tmp
rm threadkey-${version}-tb+sm.xpi 2> /dev/null
zip -r -D threadkey-${version}-tb+sm.xpi icon.png manifest.json bootstrap.js _locales/en _locales/en-US $(find _locales -type f | sort ) install.rdf chrome.manifest defaults/ chrome/locale/en-US/* $(find chrome/locale -type f | sort) -x \*atn.properties
