import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { QuestionPaper } from '@vedaai/shared';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1A1A1A',
    lineHeight: 1.5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#000000',
  },
  metaText: {
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'center',
    color: '#333333',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#6B7280',
  },
  studentInfoBlock: {
    marginBottom: 15,
  },
  studentInfoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  underlineField: {
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    flex: 1,
    marginLeft: 5,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    color: '#000000',
    textTransform: 'uppercase',
  },
  questionTypeHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  sectionInstruction: {
    fontSize: 9.5,
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 10,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 5,
  },
  questionNum: {
    width: 20,
    fontWeight: 'bold',
  },
  questionText: {
    flex: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  optionCol: {
    width: '50%',
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 4,
  },
  endPaper: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000000',
  },
  answerKeyContainer: {
    marginTop: 20,
  },
  answerKeyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 5,
  },
});

interface PaperPDFProps {
  paper: QuestionPaper;
}

export function PaperPDF({ paper }: PaperPDFProps) {
  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mcq: 'Multiple Choice Questions',
      true_false: 'True/False Questions',
      short_answer: 'Short Answer Questions',
      long_answer: 'Long Answer Questions',
      fill_blank: 'Fill in the Blanks',
    };
    return labels[type] || type;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.schoolName}>{paper.schoolName}</Text>
          <Text style={styles.metaText}>Subject: {paper.subject}</Text>
          <Text style={styles.metaText}>Class: {paper.grade}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text><Text style={styles.boldText}>Time Allowed:</Text> {paper.timeMinutes} minutes</Text>
          <Text><Text style={styles.boldText}>Maximum Marks:</Text> {paper.maxMarks}</Text>
        </View>

        <View style={styles.studentInfoBlock}>
          <Text style={styles.italicText}>{paper.generalInstructions?.[0] || 'All questions are compulsory.'}</Text>
          <View style={styles.divider} />
          
          <View style={styles.studentInfoRow}>
            <Text style={styles.boldText}>Name:</Text>
            <View style={styles.underlineField} />
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.boldText}>Roll Number:</Text>
            <View style={styles.underlineField} />
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.boldText}>Class:</Text>
            <Text style={{ marginLeft: 5 }}>{paper.grade}</Text>
            <Text style={[styles.boldText, { marginLeft: 20 }]}>Section:</Text>
            <View style={styles.underlineField} />
          </View>
        </View>

        <View style={styles.divider} />

        {paper.sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionContainer} wrap={false}>
            <Text style={styles.sectionTitle}>{section.label}</Text>
            <Text style={styles.questionTypeHeader}>{getQuestionTypeLabel(section.questionType)}</Text>
            <Text style={styles.sectionInstruction}>{section.instruction}</Text>

            {section.questions.map((q, qIdx) => (
              <View key={qIdx} style={{ marginBottom: 8 }}>
                <View style={styles.questionRow}>
                  <Text style={styles.questionNum}>{q.number}.</Text>
                  <Text style={styles.questionText}>
                    [{q.difficulty}] {q.text} <Text style={styles.boldText}>[{q.marks} Marks]</Text>
                  </Text>
                </View>

                {q.options && q.options.length > 0 && (
                  <View style={styles.optionsGrid}>
                    {q.options.map((opt, optIdx) => (
                      <Text key={optIdx} style={styles.optionCol}>
                        {opt}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.endPaper}>--- End of Question Paper ---</Text>

        <View style={styles.divider} />

        <View style={styles.answerKeyContainer} wrap={false}>
          <Text style={styles.answerKeyTitle}>Answer Key:</Text>
          {paper.sections.map((sec, secIdx) => (
            <View key={secIdx} style={{ marginBottom: 10 }}>
              <Text style={[styles.boldText, { marginBottom: 4 }]}>{sec.label}</Text>
              {sec.questions.map((q, qIdx) => {
                const ans = paper.answerKey.find((a) => a.questionNumber === q.number);
                return (
                  <View key={qIdx} style={styles.answerRow}>
                    <Text style={styles.questionNum}>{q.number}.</Text>
                    <Text style={styles.questionText}>
                      {ans ? ans.answer : q.answer || 'Answer not provided'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
