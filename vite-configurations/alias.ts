import enumerateApps from './enumerate-apps'
import path from 'node:path'

const workspace = path.join(__dirname, '../')
const resolvePath = (dir: string) => path.join(workspace, dir)
const resolveSharedPath = (dir?: string) =>
  path.join(workspace, `shared${dir ? `/${dir}` : ''}`)

const appAliases: Record<string, string> = {}
enumerateApps((appName: string) => {
  const appRoot = `./apps/${appName}/src`
  appAliases[`@${appName}`] = resolvePath(appRoot)
  appAliases[`@${appName}-styles`] = resolvePath(`${appRoot}/styles`)
  appAliases[`@${appName}-apis`] = resolvePath(`${appRoot}/apis`)
  appAliases[`@${appName}-configurations`] = resolvePath(
    `${appRoot}/configurations`
  )
  appAliases[`@${appName}-components`] = resolvePath(`${appRoot}/components`)
  appAliases[`@${appName}-stores`] = resolvePath(`${appRoot}/stores`)
  appAliases[`@${appName}-router`] = resolvePath(`${appRoot}/router`)
  appAliases[`@${appName}-views`] = resolvePath(`${appRoot}/views`)
})

const sharedDirs = [
  'configurations',
  'components',
  'directive',
  'enums',
  'hooks',
  'layouts',
  'stores',
  'theme',
  'utils'
]
const sharedAliases = () => {
  const aliases: Record<string, string> = {}
  sharedDirs.forEach(
    (dir: string) => (aliases[`@${dir}`] = resolveSharedPath(dir))
  )
  return aliases
}
export const alias = {
  'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
  '@root': resolvePath('/'),
  '@': resolveSharedPath(),
  ...sharedAliases(),
  ...appAliases
}
export default {
  resolve: {
    alias
  }
}
