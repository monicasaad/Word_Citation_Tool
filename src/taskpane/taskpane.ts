/* global Word console */

interface InsertCitationAndCommentResult {
  commentId: string;
}

interface ReferenceEntry {
  id: string;
  selectedText: string;
  sourceId: string;
  citationText: string;
  confidence: number;
  url: string;
  commentId: string;
}

/**
 * Retrieves the currently selected text from the Word document.
 */
export async function getSelectedText(): Promise<string> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.load("text");

    await context.sync();

    return selection.text.trim();
  });
}

/**
 * Highlights the currently selected text in the Word document.
 */
export async function highlightSelectedText(): Promise<void> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.font.highlightColor = "#FFF59D";

    await context.sync();
  });
}

/**
 * Inserts an in-text citation immediately after the current selection and attaches
 * a Word comment to the inserted citation containing the source ID and confidence score.
 *
 * @param inTextCitation - The formatted in-text citation to insert, e.g. "(Smith, 2023)".
 * @param sourceId - The source identifier returned by the analyze endpoint.
 * @param confidence - The confidence score returned by the analyze endpoint.
 */
export async function insertCitationAndComment(
  inTextCitation: string,
  source_id: string,
  confidence: number
): Promise<InsertCitationAndCommentResult> {
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

/**
 * Selects the document range associated with a given Word comment ID.
 *
 * @param commentId - The ID of the comment to locate.
 */
export async function selectCommentById(commentId: string): Promise<boolean> {
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

/**
 * Inserts a formatted References section at the end of the document.
 *
 * Behavior:
 * - Adds a page break
 * - Inserts a Heading 1 title called "References"
 * - Inserts each citation on a new line in alphabetical order
 *
 * @param citations - The citation entries to insert into the reference list.
 */
export async function insertReferenceList(citations: ReferenceEntry[]): Promise<void> {
  return Word.run(async (context) => {
    const sortedCitations = [...citations].sort((a, b) =>
      a.citationText.localeCompare(b.citationText)
    );

    const body = context.document.body;

    body.insertBreak(Word.BreakType.page, Word.InsertLocation.end);

    const headingRange = body.insertParagraph("References", Word.InsertLocation.end);
    headingRange.styleBuiltIn = Word.BuiltInStyleName.heading1;

    sortedCitations.forEach((citation) => {
      const refParagraph = body.insertParagraph(citation.citationText, Word.InsertLocation.end);
      refParagraph.styleBuiltIn = Word.BuiltInStyleName.normal;
    });

    await context.sync();
  });
}