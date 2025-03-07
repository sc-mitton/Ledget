interface T {
  emoji: string;
  name: string;
  period: 'month' | 'year';
}

export const yearRecommendations = [
  { emoji: '🛫', name: 'Travel', period: 'year' },
  { emoji: '🏠', name: 'Home', period: 'year' },
  { emoji: '🚗', name: 'Car', period: 'year' },
  { emoji: '👨‍👩‍👧‍👦', name: 'Family', period: 'year' },
  { emoji: '👨‍💻', name: 'Work', period: 'year' },
  { emoji: '🎓', name: 'Education', period: 'year' },
  { emoji: '🎉', name: 'Entertainment', period: 'year' },
  { emoji: '💇🏽‍♀️', name: 'Hair', period: 'year' },
] as T[];

export const monthRecommendations = [
  { emoji: '🥕', name: 'Groceries', period: 'month' },
  { emoji: '🍔', name: 'Eating Out', period: 'month' },
  { emoji: '🍺', name: 'Drinks', period: 'month' },
  { emoji: '👔', name: 'Clothing', period: 'month' },
  { emoji: '🎁', name: 'Gifts', period: 'month' },
  { emoji: '☕️', name: 'Coffee', period: 'month' },
  { emoji: '📚', name: 'Books', period: 'month' },
  { emoji: '⛽️', name: 'Gas', period: 'month' },
  { emoji: '🚕', name: 'Taxi', period: 'month' },
  { emoji: '💄', name: 'Cosmetics', period: 'month' },
  { emoji: '💈', name: 'Haircuts', period: 'month' },
  { emoji: '🎨', name: 'Hobbies', period: 'month' },
  { emoji: '💘', name: 'Dates', period: 'month' },
] as T[];
