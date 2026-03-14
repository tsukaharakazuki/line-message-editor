import { useState } from 'react'
import type { FlexBubble, FlexComponent, FlexBox } from '../../../types/line'

interface Props {
  bubble: FlexBubble
  selectedPath: string | null
  onSelect: (path: string) => void
  onAdd: (parentPath: string, type: FlexComponent['type']) => void
  onRemove: (path: string) => void
  onMove: (path: string, direction: 'up' | 'down') => void
}

const TYPE_ICONS: Record<string, string> = {
  box: '[ ]',
  text: 'T',
  image: '🖼',
  button: '⬜',
  icon: '●',
  separator: '—',
  filler: '↔',
  span: 'S',
}

const TYPE_COLORS: Record<string, string> = {
  box: 'text-purple-600',
  text: 'text-blue-600',
  image: 'text-green-600',
  button: 'text-orange-600',
  icon: 'text-yellow-600',
  separator: 'text-gray-400',
  filler: 'text-gray-400',
}

const ADD_TYPES: Array<{ type: FlexComponent['type']; label: string }> = [
  { type: 'box', label: 'Box' },
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'button', label: 'Button' },
  { type: 'icon', label: 'Icon' },
  { type: 'separator', label: 'Separator' },
  { type: 'filler', label: 'Filler' },
]

const SECTIONS = [
  { key: 'header', label: 'Header' },
  { key: 'hero', label: 'Hero' },
  { key: 'body', label: 'Body' },
  { key: 'footer', label: 'Footer' },
] as const

function getLabel(component: FlexComponent): string {
  switch (component.type) {
    case 'text': return component.text?.slice(0, 20) || '(empty)'
    case 'image': return component.url ? '...' + component.url.slice(-15) : '(no url)'
    case 'button': return component.action?.label || component.action?.type || 'button'
    case 'box': return component.layout
    case 'icon': return 'icon'
    case 'separator': return 'separator'
    case 'filler': return 'filler'
    case 'span': return component.text?.slice(0, 15) || '(empty)'
    default: return ''
  }
}

function TreeNode({
  component,
  path,
  depth,
  selectedPath,
  onSelect,
  onAdd,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: {
  component: FlexComponent
  path: string
  depth: number
  selectedPath: string | null
  onSelect: (path: string) => void
  onAdd: (parentPath: string, type: FlexComponent['type']) => void
  onRemove: (path: string) => void
  onMove: (path: string, direction: 'up' | 'down') => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const isBox = component.type === 'box'
  const isSelected = selectedPath === path
  const children = isBox ? (component as FlexBox).contents : []

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer group text-[11px] leading-tight ${
          isSelected ? 'bg-blue-100 ring-1 ring-blue-400' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onSelect(path)}
      >
        {isBox && (
          <button
            type="button"
            className="w-3 text-gray-400 flex-shrink-0"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        {!isBox && <span className="w-3 flex-shrink-0" />}
        <span className={`font-mono text-[10px] ${TYPE_COLORS[component.type] || 'text-gray-500'}`}>
          {TYPE_ICONS[component.type] || '?'}
        </span>
        <span className="font-medium text-gray-700 truncate flex-1">{component.type}</span>
        <span className="text-gray-400 truncate max-w-[80px]">{getLabel(component)}</span>

        {/* Actions - visible on hover or selected */}
        <div className={`flex gap-0.5 flex-shrink-0 ${isSelected ? 'visible' : 'invisible group-hover:visible'}`}>
          {canMoveUp && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onMove(path, 'up') }}
              className="w-4 h-4 rounded text-[9px] bg-gray-200 hover:bg-gray-300 text-gray-600">↑</button>
          )}
          {canMoveDown && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onMove(path, 'down') }}
              className="w-4 h-4 rounded text-[9px] bg-gray-200 hover:bg-gray-300 text-gray-600">↓</button>
          )}
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(path) }}
            className="w-4 h-4 rounded text-[9px] bg-red-100 hover:bg-red-200 text-red-500">×</button>
        </div>
      </div>

      {/* Children */}
      {isBox && expanded && (
        <div>
          {children.map((child, i) => (
            <TreeNode
              key={`${path}.contents.${i}`}
              component={child}
              path={`${path}.contents.${i}`}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onAdd={onAdd}
              onRemove={onRemove}
              onMove={onMove}
              canMoveUp={i > 0}
              canMoveDown={i < children.length - 1}
            />
          ))}
          {/* Add button */}
          <div className="relative" style={{ paddingLeft: `${(depth + 1) * 12 + 4}px` }}>
            <button
              type="button"
              onClick={() => setShowAdd(!showAdd)}
              className="text-[10px] text-gray-400 hover:text-[#06C755] py-0.5 font-medium"
            >
              + Add
            </button>
            {showAdd && (
              <div className="absolute left-8 top-5 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[100px]">
                {ADD_TYPES.map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => { onAdd(path, t.type); setShowAdd(false) }}
                    className="block w-full text-left px-3 py-1 text-[11px] hover:bg-gray-100 text-gray-700"
                  >
                    <span className={`font-mono mr-1.5 ${TYPE_COLORS[t.type]}`}>{TYPE_ICONS[t.type]}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ComponentTree({ bubble, selectedPath, onSelect, onAdd, onRemove, onMove }: Props) {
  const topSections = SECTIONS.filter(s => s.key !== 'footer')
  const footerSection = SECTIONS.find(s => s.key === 'footer')!

  return (
    <div className="text-xs overflow-y-auto flex flex-col h-full">
      {/* Top sections: header, hero, body */}
      <div className="flex-shrink-0">
        {topSections.map(({ key, label }) => (
          <SectionNode key={key} sectionKey={key} label={label} bubble={bubble} selectedPath={selectedPath} onSelect={onSelect} onAdd={onAdd} onRemove={onRemove} onMove={onMove} />
        ))}
      </div>

      {/* Spacer pushes footer to bottom */}
      <div className="flex-1" />

      {/* Footer always at bottom */}
      <div className="flex-shrink-0 border-t border-gray-100">
        <SectionNode sectionKey={footerSection.key} label={footerSection.label} bubble={bubble} selectedPath={selectedPath} onSelect={onSelect} onAdd={onAdd} onRemove={onRemove} onMove={onMove} />
      </div>
    </div>
  )
}

function SectionNode({ sectionKey, label, bubble, selectedPath, onSelect, onAdd, onRemove, onMove }: {
  sectionKey: string
  label: string
  bubble: FlexBubble
  selectedPath: string | null
  onSelect: (path: string) => void
  onAdd: (parentPath: string, type: FlexComponent['type']) => void
  onRemove: (path: string) => void
  onMove: (path: string, direction: 'up' | 'down') => void
}) {
  const section = bubble[sectionKey as keyof FlexBubble]

  if (!section || typeof section !== 'object' || !('type' in (section as Record<string, unknown>))) {
    return (
      <div className="py-1 px-2">
        <span className="text-[11px] font-medium text-gray-300">{label}</span>
        <span className="text-[10px] text-gray-300 ml-1">(empty)</span>
      </div>
    )
  }

  // hero can be any FlexComponent (usually image)
  if (sectionKey === 'hero') {
    return (
      <div>
        <div className="py-0.5 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
        <TreeNode
          component={section as FlexComponent}
          path="hero"
          depth={0}
          selectedPath={selectedPath}
          onSelect={onSelect}
          onAdd={onAdd}
          onRemove={onRemove}
          onMove={onMove}
          canMoveUp={false}
          canMoveDown={false}
        />
      </div>
    )
  }

  // header, body, footer are FlexBox
  const box = section as FlexBox
  return (
    <div>
      <div
        className={`py-0.5 px-2 text-[11px] font-semibold uppercase tracking-wider cursor-pointer hover:text-[#06C755] ${
          selectedPath === sectionKey ? 'text-blue-600' : 'text-gray-500'
        }`}
        onClick={() => onSelect(sectionKey)}
      >
        {label}
      </div>
      {box.contents.map((child, i) => (
        <TreeNode
          key={`${sectionKey}.contents.${i}`}
          component={child}
          path={`${sectionKey}.contents.${i}`}
          depth={1}
          selectedPath={selectedPath}
          onSelect={onSelect}
          onAdd={onAdd}
          onRemove={onRemove}
          onMove={onMove}
          canMoveUp={i > 0}
          canMoveDown={i < box.contents.length - 1}
        />
      ))}
      {/* Add to section root */}
      <div className="relative" style={{ paddingLeft: '16px' }}>
        <AddButton parentPath={sectionKey} onAdd={onAdd} />
      </div>
    </div>
  )
}

function AddButton({ parentPath, onAdd }: { parentPath: string; onAdd: (path: string, type: FlexComponent['type']) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowAdd(!showAdd)}
        className="text-[10px] text-gray-400 hover:text-[#06C755] py-0.5 font-medium"
      >
        + Add
      </button>
      {showAdd && (
        <div className="absolute left-0 top-5 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[100px]">
          {ADD_TYPES.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => { onAdd(parentPath, t.type); setShowAdd(false) }}
              className="block w-full text-left px-3 py-1 text-[11px] hover:bg-gray-100 text-gray-700"
            >
              <span className={`font-mono mr-1.5 ${TYPE_COLORS[t.type]}`}>{TYPE_ICONS[t.type]}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
