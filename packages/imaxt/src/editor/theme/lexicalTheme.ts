import type { EditorThemeClasses } from 'lexical';

/** Classnames Lexical attaches to the DOM it generates; styled in `editor.css`. */
export const EDITOR_THEME: EditorThemeClasses = {
  paragraph: 'imx-ed-p',
  heading: {
    h1: 'imx-ed-h1',
    h2: 'imx-ed-h2',
    h3: 'imx-ed-h3',
    h4: 'imx-ed-h4',
    h5: 'imx-ed-h5',
    h6: 'imx-ed-h6',
  },
  quote: 'imx-ed-quote',
  list: {
    ul: 'imx-ed-ul',
    ol: 'imx-ed-ol',
    listitem: 'imx-ed-li',
    listitemChecked: 'imx-ed-li-checked',
    listitemUnchecked: 'imx-ed-li-unchecked',
    nested: { listitem: 'imx-ed-li-nested' },
  },
  link: 'imx-ed-link',
  code: 'imx-ed-code',
  text: {
    bold: 'imx-ed-bold',
    italic: 'imx-ed-italic',
    strikethrough: 'imx-ed-strikethrough',
    code: 'imx-ed-inline-code',
  },
  table: 'imx-ed-table',
  tableRow: 'imx-ed-table-row',
  tableCell: 'imx-ed-table-cell',
  tableCellHeader: 'imx-ed-table-cell-header',
};
