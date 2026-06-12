import { renderToStaticMarkup } from 'react-dom/server'
import { HomeRoute } from './routes/HomeRoute'

export function renderStaticHome(): string {
  return renderToStaticMarkup(
    <HomeRoute languageMode="zh" themeMode="light" />,
  )
}
