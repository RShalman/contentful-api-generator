# contentful-api-generator

## Output files

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
