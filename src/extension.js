const vscode = require('vscode');

const Commands = vscode.commands;
const Window = vscode.window;
const symbolsCyrToLat = require('./symbols-cyr-to-lat');
const symbolsLatToCyr = require('./symbols-lat-to-cyr');
const { toArray } = require('./helpers/array');
const wordsExceptios = require('./dictonaries');

const converter = (text, converTable) => {
  const words = text
    .trim()
    .split(' ')
    .map(word => {
      if (typeof wordsExceptios[word] !== 'undefined') {
        return wordsExceptios[word];
      }

      return word;
    }); 

  return toArray(words.join(' '))
    .map(symbol => (!(symbol in converTable) ? symbol : converTable[symbol]))
    .join('');
};

const strToSlug = str => {
  const strTranslit = converter(str, symbolsCyrToLat).toLowerCase();
  return strTranslit.replace(/[^a-z0-9]/gm, '-').replace(/[-]{1,}/gm, '-');
};

const strToCyr = str => {
  const strTranslit = converter(str, symbolsLatToCyr);
  return strTranslit.replace(/дж/g, 'џ').replace(/нј/g, 'њ').replace(/лј/g, 'љ').replace(/Дж/g, 'Џ').replace(/Нј/g, 'Њ').replace(/Лј/g, 'Љ')
  .replace(/ДЖ/g, 'Џ').replace(/НЈ/g, 'Њ').replace(/ЛЈ/g, 'Љ');
};

const sertranslitCyrToLat = () => {
  const editor = Window.activeTextEditor;
  if (!editor) return;

  const selections = editor.selections;

  if (selections.length === 0) return;

  editor.edit(editBuilder => {
    selections.forEach(selectionItem => {
      const text = editor.document.getText(selectionItem);
      const convertedText = converter(text, symbolsCyrToLat);

      editBuilder.replace(selectionItem, convertedText);
    });
  });
};

const sertranslitLatToCyr = () => {
  const editor = Window.activeTextEditor;
  if (!editor) return;

  const selections = editor.selections;

  if (selections.length === 0) return;

  editor.edit(editBuilder => {
    selections.forEach(selectionItem => {
      const text = editor.document.getText(selectionItem);
      const convertedText = strToCyr(text);

      editBuilder.replace(selectionItem, convertedText);
    });
  });
};

const sertranslitSlug = () => {
  const editor = Window.activeTextEditor;
  if (!editor) return;

  const selections = editor.selections;

  if (selections.length === 0) return;

  editor.edit(editBuilder => {
    selections.forEach(selectionItem => {
      const text = editor.document.getText(selectionItem);
      const convertedText = strToSlug(text);

      editBuilder.replace(selectionItem, convertedText);
    });
  });
};

const reg = (name, callback) => {
  Commands.registerTextEditorCommand(`extension.${name}`, callback);
};

exports.activate = context => {
  context.subscriptions.push(reg('sertranslitCyrToLat', sertranslitCyrToLat));
  context.subscriptions.push(reg('sertranslitLatToCyr', sertranslitLatToCyr));
  context.subscriptions.push(reg('sertranslitSlug', sertranslitSlug));
};

exports.deactivate = () => {};
