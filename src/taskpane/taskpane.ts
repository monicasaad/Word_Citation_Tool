/* global Word console */

export async function getSelectedText() {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.load("text");
    await context.sync();
    return selection.text.trim();
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

export async function selectCommentById(commentId: string) {
  return Word.run(async (context) => {
    const comments = context.document.body.getComments();
    comments.load("items/id");

    await context.sync();

    const targetComment = comments.items.find((comment) => comment.id === commentId);

    if (!targetComment) {
      return false;
    }

    const commentRange = targetComment.getRange();
    commentRange.select();

    await context.sync();

    return true;
  });
}
