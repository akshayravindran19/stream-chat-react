#!/bin/bash
# generate snapshots in a container to match the CI env

docker run --rm --network host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v1.22.0-focal /bin/bash
npm install
npx playwright test --update-snapshots
