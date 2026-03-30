// mobile/src/screens/StyleQuizScreen.js
// 10-question style quiz. Answers are saved to DynamoDB via /survey Lambda.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { saveSurvey } from '../services/api';

const QUESTIONS = [
  {
    id: 'bodyType',
    question: 'How would you describe your body type?',
    options: ['Petite', 'Athletic', 'Curvy', 'Tall & Slim', 'Plus Size', 'Other'],
  },
  {
    id: 'styleVibe',
    question: "What's your overall style vibe?",
    options: ['Minimalist', 'Streetwear', 'Classic/Preppy', 'Bohemian', 'Edgy/Alt', 'Glam'],
  },
  {
    id: 'colorPrefs',
    question: 'What colors do you gravitate toward?',
    options: ['Neutrals', 'Earth Tones', 'Bold & Bright', 'Pastels', 'Monochrome', 'Mixed'],
    multi: true,
  },
  {
    id: 'budget',
    question: "What's your typical clothing budget per item?",
    options: ['Under $30', '$30–$75', '$75–$150', '$150–$300', '$300+'],
  },
  {
    id: 'occasions',
    question: 'What occasions do you dress for most?',
    options: ['Work/Office', 'Casual/Everyday', 'Nights Out', 'Formal Events', 'Gym/Active', 'Travel'],
    multi: true,
  },
  {
    id: 'fitPreference',
    question: 'What fit do you prefer?',
    options: ['Oversized/Relaxed', 'Fitted', 'Mix of Both'],
  },
  {
    id: 'season',
    question: 'Which season are you shopping for?',
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
  },
  {
    id: 'sustainability',
    question: 'How important is sustainability to you?',
    options: ['Very important', 'Somewhat important', "Doesn't matter"],
  },
];

export default function StyleQuizScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const current = QUESTIONS[step];
  const isMulti = current.multi;
  const selected = answers[current.id] || (isMulti ? [] : null);

  function selectOption(option) {
    if (isMulti) {
      const already = selected.includes(option);
      setAnswers({
        ...answers,
        [current.id]: already ? selected.filter(o => o !== option) : [...selected, option],
      });
    } else {
      setAnswers({ ...answers, [current.id]: option });
    }
  }

  function isSelected(option) {
    return isMulti ? selected.includes(option) : selected === option;
  }

  function canAdvance() {
    return isMulti ? selected.length > 0 : selected !== null;
  }

  async function handleNext() {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Last question — submit
      setLoading(true);
      try {
        await saveSurvey(answers);
        navigation.replace('Recommendations');
      } catch (e) {
        Alert.alert('Error', 'Could not save your answers. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progress}>{step + 1} / {QUESTIONS.length}</Text>
      <Text style={styles.question}>{current.question}</Text>
      {isMulti && <Text style={styles.hint}>Select all that apply</Text>}

      <View style={styles.options}>
        {current.options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, isSelected(opt) && styles.optionSelected]}
            onPress={() => selectOption(opt)}
          >
            <Text style={[styles.optionText, isSelected(opt) && styles.optionTextSelected]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextBtn, !canAdvance() && styles.nextBtnDisabled]}
        onPress={handleNext}
        disabled={!canAdvance() || loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.nextBtnText}>{step < QUESTIONS.length - 1 ? 'Next →' : 'Get My Style ✨'}</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48 },
  progress: { color: '#888', marginBottom: 8, fontSize: 14 },
  question: { fontSize: 22, fontWeight: '700', marginBottom: 8, lineHeight: 30 },
  hint: { color: '#888', marginBottom: 16, fontSize: 13 },
  options: { gap: 12, marginBottom: 32 },
  option: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 12,
    padding: 16, backgroundColor: '#fafafa',
  },
  optionSelected: { borderColor: '#000', backgroundColor: '#000' },
  optionText: { fontSize: 16, color: '#333' },
  optionTextSelected: { color: '#fff', fontWeight: '600' },
  nextBtn: {
    backgroundColor: '#000', padding: 18, borderRadius: 14, alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#ccc' },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
