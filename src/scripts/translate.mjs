// src/scripts/translate.mjs
import { v2 as GoogleCloudTranslate } from '@google-cloud/translate';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { SupportedLanguages } from '@prisma/client'; // Import SupportedLanguages enum

const Translate = GoogleCloudTranslate.Translate;

// Load service account key from JSON file in root
const keyFilePath = join(process.cwd(), 'google-cloud-keys.json');
if (!existsSync(keyFilePath)) {
  throw new Error(
    `Service account key file ${keyFilePath} does not exist. Please place it in the root directory.`
  );
}

let credentials;
try {
  credentials = JSON.parse(readFileSync(keyFilePath, 'utf8'));
} catch (error) {
  throw new Error(`Failed to parse ${keyFilePath}: ${error.message}`);
}

// Initialize Translate with the full credentials object
const translate = new Translate({ credentials });

// Function to translate text
async function translateText(text, targetLang) {
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    console.error(`Error translating "${text}" to ${targetLang}:`, error);
    return text;
  }
}

// Function to generate translation files
async function generateTranslations() {
  const sourcePath = join(
    process.cwd(),
    'public',
    'locales',
    'en',
    'common.json'
  );
  if (!existsSync(sourcePath)) {
    throw new Error(
      `Source file ${sourcePath} does not exist. Please create it first.`
    );
  }

  let sourceTranslations;
  try {
    sourceTranslations = JSON.parse(readFileSync(sourcePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse ${sourcePath}: ${error.message}`);
  }

  const languages = Object.values(SupportedLanguages).filter(
    (lang) => lang !== 'en'
  );

  for (const lang of languages) {
    const translations = {};

    for (const [key, value] of Object.entries(sourceTranslations)) {
      translations[key] = await translateText(value, lang);
    }

    const outputDir = join(process.cwd(), 'public', 'locales', lang);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = join(outputDir, 'common.json');
    writeFileSync(outputPath, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`Generated translations for ${lang} at ${outputPath}`);
  }
}

// Run the script
generateTranslations()
  .then(() => console.log('Translation generation completed.'))
  .catch((error) => {
    console.error('Translation script failed:', error);
    process.exit(1);
  });
