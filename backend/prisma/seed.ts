import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LESSON_CONTENT = `English sentences usually follow one order: Subject + Verb + Object (SVO).

Subject = the doer
Verb = the action
Object = the thing

Examples
- I eat rice.
- She reads a book.
- They play football.

Wrong: Rice eat I.
Right: I eat rice.

Watch the short video, read these notes, then answer 10 questions.`;

const QUESTIONS: Array<{
  question: string;
  options: Array<{ text: string; correct: boolean }>;
}> = [
  {
    question: "Choose the correct sentence.",
    options: [
      { text: "Eat I rice.", correct: false },
      { text: "I eat rice.", correct: true },
      { text: "Rice I eat.", correct: false },
      { text: "I rice eat.", correct: false },
    ],
  },
  {
    question: "What is the subject in \"She plays football\"?",
    options: [
      { text: "plays", correct: false },
      { text: "football", correct: false },
      { text: "She", correct: true },
      { text: "plays football", correct: false },
    ],
  },
  {
    question: "What is the verb in \"They watch TV\"?",
    options: [
      { text: "They", correct: false },
      { text: "watch", correct: true },
      { text: "TV", correct: false },
      { text: "They watch", correct: false },
    ],
  },
  {
    question: "Choose the correct sentence.",
    options: [
      { text: "The boy kicks the ball.", correct: true },
      { text: "Kicks the boy the ball.", correct: false },
      { text: "The ball the boy kicks the.", correct: false },
      { text: "Boy the ball kicks.", correct: false },
    ],
  },
  {
    question: "English word order is usually:",
    options: [
      { text: "Object + Verb + Subject", correct: false },
      { text: "Subject + Verb + Object", correct: true },
      { text: "Verb + Subject + Object", correct: false },
      { text: "Subject + Object + Verb", correct: false },
    ],
  },
  {
    question: "Choose the correct sentence.",
    options: [
      { text: "We drink water.", correct: true },
      { text: "Drink we water.", correct: false },
      { text: "Water drink we.", correct: false },
      { text: "We water drink.", correct: false },
    ],
  },
  {
    question: "In \"Ali writes a letter\", the object is:",
    options: [
      { text: "Ali", correct: false },
      { text: "writes", correct: false },
      { text: "a letter", correct: true },
      { text: "Ali writes", correct: false },
    ],
  },
  {
    question: "Choose the correct sentence.",
    options: [
      { text: "Mother cooks dinner.", correct: true },
      { text: "Cooks mother dinner.", correct: false },
      { text: "Dinner cooks mother.", correct: false },
      { text: "Mother dinner cooks.", correct: false },
    ],
  },
  {
    question: "Which sentence is wrong?",
    options: [
      { text: "I read a book.", correct: false },
      { text: "He opens the door.", correct: false },
      { text: "Opens he the door.", correct: true },
      { text: "They play cricket.", correct: false },
    ],
  },
  {
    question: "Complete: \"The cat ___ milk.\"",
    options: [
      { text: "drinks", correct: true },
      { text: "drink the", correct: false },
      { text: "milk drinks", correct: false },
      { text: "the drinks", correct: false },
    ],
  },
];

async function main(): Promise<void> {
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const studentHash = await bcrypt.hash("Student@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gamlish.test" },
    update: {},
    create: {
      name: "Lab Admin",
      email: "admin@gamlish.test",
      password: adminHash,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "student@gamlish.test" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@gamlish.test",
      password: studentHash,
      role: "student",
    },
  });

  const level = await prisma.level.upsert({
    where: { levelNumber: 1 },
    update: { title: "Level 1 · Word Order" },
    create: { levelNumber: 1, title: "Level 1 · Word Order" },
  });

  const existingLesson = await prisma.lesson.findFirst({
    where: { levelId: level.id },
    include: { questions: true },
  });

  if (existingLesson && existingLesson.questions.length >= 10) {
    await prisma.lesson.update({
      where: { id: existingLesson.id },
      data: { videoUrl: "https://youtu.be/UeD25OfPXew" },
    });
    return;
  }

  if (existingLesson) {
    await prisma.lesson.delete({ where: { id: existingLesson.id } });
  }

  await prisma.lesson.create({
    data: {
      levelId: level.id,
      title: "Make a Simple English Sentence",
      videoUrl: "https://youtu.be/UeD25OfPXew",
      lessonContent: LESSON_CONTENT,
      questions: {
        create: QUESTIONS.map((item) => ({
          question: item.question,
          options: {
            create: item.options.map((option) => ({
              optionText: option.text,
              isCorrect: option.correct,
            })),
          },
        })),
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    process.stderr.write(`${String(error)}\n`);
    await prisma.$disconnect();
    process.exit(1);
  });
