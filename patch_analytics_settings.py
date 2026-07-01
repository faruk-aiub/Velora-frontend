import os

analytics_path = "src/app/admin/analytics/page.tsx"
settings_path = "src/app/admin/settings/page.tsx"

with open(analytics_path, 'r') as f:
    content = f.read()
    
# Patch cards in analytics
content = content.replace(
    '<Card className="border-[#E8E1DE] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">',
    '<Card className="rounded-3xl border-0 bg-white shadow-sm ring-0">'
)
content = content.replace(
    '<CardTitle className="text-[#3A3331]">',
    '<CardTitle className="text-xl font-bold text-gray-900">'
)
content = content.replace(
    '<div className="text-4xl font-bold text-[#3A3331]">',
    '<div className="text-4xl font-bold text-gray-900">'
)
content = content.replace(
    '<p className="text-sm text-[#5C8D6D] mt-2">',
    '<p className="text-sm text-green-500 font-bold mt-2">'
)
# Patch recharts colors
content = content.replace(
    'stroke="#E8E1DE"',
    'stroke="#E5E7EB"'
)
content = content.replace(
    'stroke="#7A7371"',
    'stroke="#6B7280"'
)
content = content.replace(
    'cursor={{ fill: \'rgba(188, 132, 119, 0.05)\' }} contentStyle={{ backgroundColor: \'#ffffff\', border: \'1px solid #E8E1DE\', borderRadius: \'8px\', color: \'#3A3331\' }}',
    'cursor={{ fill: \'#F3F4F6\' }} contentStyle={{ backgroundColor: \'#ffffff\', border: \'1px solid #E5E7EB\', borderRadius: \'16px\', color: \'#111827\', fontWeight: \'bold\' }}'
)
content = content.replace(
    'radius={[4, 4, 0, 0]}',
    'radius={[6, 6, 0, 0]}'
)
with open(analytics_path, 'w') as f:
    f.write(content)

with open(settings_path, 'r') as f:
    content = f.read()

# Settings styling
content = content.replace(
    '<div className="p-6 max-w-2xl mx-auto">',
    '<div className="p-2 max-w-2xl mx-auto">'
)
content = content.replace(
    '<h1 className="text-2xl font-bold mb-6">Settings</h1>',
    '<div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Manage admin account preferences.</p></div>'
)
content = content.replace(
    '<Card>',
    '<Card className="rounded-3xl border-0 bg-white shadow-sm ring-0 overflow-hidden">'
)
content = content.replace(
    '<Input',
    '<Input className="rounded-xl h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"'
)
content = content.replace(
    '<Button type="submit" disabled={isLoading}>',
    '<Button type="submit" disabled={isLoading} className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 font-bold shadow-sm">'
)

with open(settings_path, 'w') as f:
    f.write(content)

print("Analytics and settings patched")
