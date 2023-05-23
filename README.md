# Contentful API Generator

### Description

A Contentful API Generator for local usage with TypeScript cover.

### Motivation

The purpose of this package is to generate a local API for your Contentful space. It saves you from using the API
provided by Contentful as it's not absolutely free. This way you can tweak things as you want and have more impact on
how to use the data. Very handy if some data processing needed to be done at built time (like processing assets for SSG)
. And as it comes with TS you can easily cover your interfaces with those types from Contentful Entries with no extra
effort.

### Installation

``
npm i -D contentful-api-generator
``

### Usage

```ecmascript 6
// For ESM
import {
    generateContentfulApi,
    fetchContentfulSpaceData,
    moveAssetsToPublicFolder,
} from 'contentful-api-generator'

// For CJS
const {
    generateContentfulApi,
    fetchContentfulSpaceData,
    moveAssetsToPublicFolder,
} = require('contentful-api-generator')
```

- To generate the whole API, types, extra jsons simply run `generateContentfulApi`
- To only fetch the `contentful-export.json` use `fetchContentfulSpaceData`
- To only manipulate where your assets are stored (once fetched) use `moveAssetsToPublicFolder`

### Interface

Below you will find short description of the API generator's interface.

```typescript
  interface CAGOptions {
    spaceId: string;
    // - Contentful Space ID can be found in settings
    managementToken: string;
    // - Contentful Space mandatory token (as well in settings)
    basePath: string;
    // - Base folder where generated files will be placed in
    // DEFAULT = "/api/contentful"
    assetsPath?: string;
    // - Base path to folder where assets will be stored (if downloadAssets === true)
    // DEFAULT: same as basePath
    contentFile?: string;
    // - Name of the file to store exported contentful data
    // DEFAULT: "contentful-export.json"
    exportDir?: string;
    // - Directory to which you want your contentful data to be stored
    // DEFAULT: basePath + '/data'
    errorLogFile?: string;
    // - Error log file path
    // DEFAULT: "error.log"
    downloadAssets?: boolean;
    // - Defines if you want to download Contentful Assets or not
    // DEFAULT: true
    contentEntriesJSONPath?: string;
    // - Path to where to store entries data
    //  DEFAULT: basePath + '/contentEntries.json'
    contentTypesJSONPath?: string;
    // - Path to where to store entries types
    //  DEFAULT: basePath + '/contentTypes.json'
    apiTSPath?: string;
    // - Path to where to store the generated API
    //  DEFAULT: basePath + '/api.ts'
}
```

### Output files

The structure of the output files is following (within the default folder or the one that was provided by user):

- **api.ts** - main entrypoint with all the contentful models to be accessed through. Also keeps the types for the
  models.
- **contentEntries.json** - all the contentful entries with *Links* transformed to eventual entries (like images).
- **contentTypes.json** - content model (used for creating contentTypes & slugs)
- **contentTypes.ts** - content model types declarations can be found here
- **locales.json** - exported file with available locales
- **locales.ts** - type for used (available) locales
- **slugs.ts** - types for all the slugs
- **data/contentful-export.json** - the initial export file from contentful (can be deleted after api is generated)
- **your-path/contentful/(images | assets | downloads).ctfassets.net** - folders with assets

### Issues & Contributions

[Issues can be raised here](https://github.com/RShalman/contentful-api-generator/issues)

Contributions section and guides to be implemented.