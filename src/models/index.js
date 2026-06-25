// src/models/index.js - Export all data models
import Document from './document.js';
import Vocabulary from './vocabulary.js';
import Section from './section.js';
import WordsContent from './words-content.js';
import ParagraphContent from './paragraph-content.js';
import AlphabetCharacter from './alphabet-character.js';
import AlphabetTableContent from './alphabet-table-content.js';
import CharacterGridContent from './character-grid-content.js';
import CharacterCardContent from './character-card-content.js';
import SoundMatching from './sound-matching.js';
import ToneRuleTable from './tone-rule-table.js';
import ExplanationContent from './explanation-content.js';

export default {
    Document,
    Vocabulary,
    Section,
    WordsContent,
    ParagraphContent,
    AlphabetCharacter,
    AlphabetTableContent,
    CharacterGridContent,
    CharacterCardContent,
    SoundMatching,
    ToneRuleTable,
    ExplanationContent
};