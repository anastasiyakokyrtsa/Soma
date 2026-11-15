export const onboarding = {
  ru: {
    aboutApp1Title: 'Твоё состояние — это система',
    aboutApp1Description: 'Энергия, настроение и внимание движутся по своим траекториям. И их можно научиться читать.',
    aboutApp1Button: 'Далее',
    aboutApp2Title: 'Замечай закономерности',
    aboutApp2Description: 'Soma отслеживает твои ритмы, реакции и привычки и показывает, что влияет на твоё состояние.',
    aboutApp2Button: 'Далее',
    aboutApp3Title: 'Живи в своём ритме',
    aboutApp3Description: 'Наблюдай фазы напряжения и восстановления, настраивай нагрузку под свой ритм.',
    aboutApp3Button: 'Начать исследование',

    nameTitle: 'Как тебя зовут?',
    nameFieldLabel: 'Твоё имя',

    emailTitle: 'Твоя электронная почта',
    emailDescription: 'Мы используем её только для важных уведомлений и сохранения прогресса',
    emailFieldLabel: 'Твоя почта',

    genderTitle: 'Укажи свой пол',
    genderDescription: 'Это необходимо, чтобы учитывать гормональные циклы, которые напрямую влияют на физическое состояние, сон и активность',
    genderFemale: 'Женщина',
    genderMale: 'Мужчина',

    supportTitle: 'В чем тебе больше всего нужна поддержка?',
    supportDescription: 'Можно выбрать несколько вариантов. Советуем начать с 2-3 самых актуальных пунктов',

    chooseApproachTitle: 'Выбери подход',
    chooseApproachDescription: 'Это поможет точнее подобрать рекомендации. Подход всегда можно изменить в настройках',
  },
  en: {
    aboutApp1Title: 'Your state is a system',
    aboutApp1Description: 'Energy, mood, and focus move along their own patterns — and you can learn to read them.',
    aboutApp1Button: 'Next',
    aboutApp2Title: 'Notice the patterns',
    aboutApp2Description: "Soma tracks your rhythms, reactions, and habits, and shows you what's shaping your state.",
    aboutApp2Button: 'Next',
    aboutApp3Title: 'Live in your own rhythm',
    aboutApp3Description: 'Watch your phases of tension and recovery, and pace yourself to match your own rhythm.',
    aboutApp3Button: 'Start exploring',

    nameTitle: "What's your name?",
    nameFieldLabel: 'Your name',

    emailTitle: 'Your email address',
    emailDescription: 'We only use it for important notifications and to save your progress',
    emailFieldLabel: 'Your email',

    genderTitle: "What's your sex?",
    genderDescription: 'This helps us account for hormonal cycles that directly affect your physical state, sleep, and activity',
    genderFemale: 'Female',
    genderMale: 'Male',

    supportTitle: 'Where do you need the most support?',
    supportDescription: 'You can choose several. We recommend starting with the 2–3 that feel most relevant',

    chooseApproachTitle: 'Choose your approach',
    chooseApproachDescription: 'This helps us tailor recommendations more precisely. You can always change your approach later in settings',
  },
};

export const supportOptions: Record<'ru' | 'en', string[]> = {
  ru: [
    'Телесное напряжение',
    'Качество сна',
    'Тревога',
    'Перепады настроения',
    'Уровень стресса',
    'Общее самочувствие',
    'Эмоциональный баланс',
    'Усталость',
    'Рассеянность',
    'Отсутствие мотивации',
    'Раздражительность',
    'Прокрастинация',
  ],
  en: [
    'Physical tension',
    'Sleep quality',
    'Anxiety',
    'Mood swings',
    'Stress levels',
    'Overall well-being',
    'Emotional balance',
    'Fatigue',
    'Difficulty focusing',
    'Lack of motivation',
    'Irritability',
    'Procrastination',
  ],
};

export const approaches: Record<'ru' | 'en', { title: string; description: string }[]> = {
  ru: [
    { title: 'Научно-практический', description: 'Факторы тела, сна\nи окружающей среды' },
    { title: 'Астрологический', description: 'Циклы, символы и астрологические интерпретации' },
    { title: 'Синтез двух систем', description: 'Объединяет оба подхода' },
  ],
  en: [
    { title: 'Science-based', description: 'Body, sleep,\nand environment factors' },
    { title: 'Astrological', description: 'Cycles, symbols, and astrological interpretations' },
    { title: 'A blend of both', description: 'Combines both approaches' },
  ],
};
