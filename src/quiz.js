export function scoreAnswers(answers, questions) {
  return questions.reduce((total, question, index) => total + Number(answers[index] === question.answer), 0);
}

