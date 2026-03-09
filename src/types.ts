export interface Word {
  id: string;
  text: string;
  type: 'character' | 'word';
  pinyin: string;
  radical?: string;
  relatedWords: string[];
  sentence: string;
}

export interface Pack {
  id: string;
  title: string;
  words: Word[];
  createdAt: number;
}
