/* global Word console */

export async function insertCitationAfterSelection(inTextCitation: string): Promise<Word.Range> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();

    const insertedRange = selection.insertText(` ${inTextCitation}`, Word.InsertLocation.after);
    insertedRange.load("text");

    await context.sync();

    return insertedRange;
  });
}

export async function getSelectedText() {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.load("text");
    await context.sync();
    return selection.text.trim();
  });
}
