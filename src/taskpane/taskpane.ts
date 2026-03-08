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

export async function insertCitationAndComment(
  inTextCitation: string,
  source_id: string,
  confidence: number
) {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();

    const insertedRange = selection.insertText(` ${inTextCitation}`, Word.InsertLocation.after);

    const commentText = `source_id= ${source_id}; confidence= ${confidence}`;
    const comment = insertedRange.insertComment(commentText);
    comment.load("id");

    await context.sync();

    return {
      commentId: comment.id,
    };
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
