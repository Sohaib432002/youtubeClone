import { useContext, useEffect } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { usePrefs } from '../../Hooks/PrefsContext'

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { key: 'appearance', label: 'Appearance', options: ['Dark theme', 'Light theme', 'Device theme'] },
      { key: 'language', label: 'Language', options: ['English', 'Urdu', 'Hindi', 'Arabic'] },
      { key: 'location', label: 'Location', options: ['Pakistan', 'United States', 'United Kingdom', 'India', 'Canada'] },
    ],
  },
  {
    title: 'Restrictions',
    items: [
      {
        key: 'restricted',
        label: 'Restricted Mode',
        options: ['Off', 'On'],
        help: 'Helps hide potentially mature videos. This is a demo filter on catalog content.',
      },
    ],
  },
]

const Settings = () => {
  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)
  const { prefs, setPref } = usePrefs()

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-4 ${leftPad} text-white max-w-3xl`}>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {SECTIONS.map((section) => (
        <section key={section.title} className="mb-8">
          <h2 className="text-lg font-medium mb-3 text-[#f1f1f1]">{section.title}</h2>
          <div className="rounded-xl bg-[#212121] overflow-hidden divide-y divide-[#303030]">
            {section.items.map((item) => (
              <div key={item.key} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="min-w-0">
                  <p className="font-medium">{item.label}</p>
                  {item.help ? <p className="text-xs text-[#aaa] mt-1">{item.help}</p> : null}
                  <p className="text-xs text-[#3ea6ff] mt-1">Current: {prefs[item.key]}</p>
                </div>
                <select
                  value={prefs[item.key]}
                  onChange={(e) => setPref(item.key, e.target.value)}
                  className="bg-[#0f0f0f] border border-[#3f3f3f] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3ea6ff]"
                >
                  {item.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-[#aaa]">
        Language <b className="text-white">Urdu</b> enables RTL layout. Restricted Mode{' '}
        <b className="text-white">On</b> filters some catalog titles.
      </p>
    </div>
  )
}

export default Settings
