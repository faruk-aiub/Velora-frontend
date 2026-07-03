const fs = require('fs');
const page = fs.readFileSync('src/app/(store)/page.tsx', 'utf8');
let shop = fs.readFileSync('src/app/(store)/shop/page.tsx', 'utf8');

const heroRegex = /\{\/\* ── Hero Section ── \*\/\}[\s\S]*?\{\/\* ── Features Strip ── \*\/\}/;
const heroMatch = page.match(heroRegex);
shop = shop.replace(heroRegex, heroMatch[0]);

const featuresRegex = /\{\/\* ── Features Strip ── \*\/\}[\s\S]*?\{\/\* ── Shop by Categories ── \*\/\}/;
const featuresMatch = page.match(featuresRegex);
shop = shop.replace(featuresRegex, featuresMatch[0]);

const categoriesRegex = /\{\/\* ── Shop by Categories ── \*\/\}[\s\S]*?<\/section>/;
const categoriesMatch = page.match(categoriesRegex);
shop = shop.replace(/\{\/\* ── Shop by Categories ── \*\/\}[\s\S]*?<\/section>/, categoriesMatch[0]);

const specialRegex = /\{\/\* ── Special Offer ── \*\/\}[\s\S]*?\{\/\* ── Testimonials ── \*\/\}/;
const specialMatch = page.match(specialRegex);
shop = shop.replace(specialRegex, specialMatch[0]);

const testimonialsRegex = /\{\/\* ── Testimonials ── \*\/\}[\s\S]*?<\/section>/;
const testimonialsMatch = page.match(testimonialsRegex);
shop = shop.replace(/\{\/\* ── Testimonials ── \*\/\}[\s\S]*?<\/section>/, testimonialsMatch[0]);

// Fix colors in the middle section
shop = shop.replace(/text-\[28px\]/g, 'text-3xl');
shop = shop.replace(/text-\[13px\]/g, 'text-sm');
shop = shop.replace(/text-\[\#7A915C\]/g, 'text-[#BC8477]');

fs.writeFileSync('src/app/(store)/shop/page.tsx', shop);
console.log('Done!');
