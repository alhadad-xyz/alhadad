import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '032n3f6j',
    dataset: 'production'
  },
  studioHost: 'alhadad',
  deployment: {
    appId: 'r7pr7f6dwg0r328v08gp83nf',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
