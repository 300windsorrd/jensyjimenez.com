const fs = require('fs');
const path = require('path');
const { Feed } = require('feed');

const site = 'https://jensyjimenez.com';
const feed = new Feed({ title: 'Jensy Jimenez Writing', id: site, link: site });
const dir = path.join(process.cwd(), 'content/writing');
for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.mdx')) continue;
  const slug = file.replace(/\.mdx$/, '');
  feed.addItem({ title: slug.replace(/-/g, ' '), id: `${site}/writing/${slug}`, link: `${site}/writing/${slug}` });
}
fs.writeFileSync(path.join(process.cwd(), 'public', 'rss.xml'), feed.rss2());
