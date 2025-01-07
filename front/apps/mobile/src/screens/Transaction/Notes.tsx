import React, { useEffect, useState } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Keyboard,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import Animated, {
  SlideOutDown,
  SlideInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useTransition } from '@react-spring/web';
import dayjs from 'dayjs';

import styles from './styles/notes';
import {
  BoxHeader,
  Box,
  Avatar,
  Text,
  CustomScrollView,
  Seperator,
  Button,
  AnimatedView,
  SwipeDelete,
} from '@ledget/native-ui';
import {
  Transaction,
  useAddNoteMutation,
  useUpdateDeleteNoteMutation,
  Note as NoteT,
  useGetCoOwnerQuery,
  useGetMeQuery,
} from '@ledget/shared-features';

interface Note extends NoteT {
  localId: string;
}

const NoteModal = ({
  note,
  onSubmit,
  onClose,
}: {
  note: Note | null;
  onSubmit: (text: string) => void;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(note?.text || '');

  // Hide on Keyboard dismiss
  // In development mode on the emulators, this will cause the modal to close prematurely
  // unlesss io > software > keyboard > toggle software keyboard is enabled. If you use your
  // laptop's keyboard, then the modal will still close. Use the emulator's keyboard to test.
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        onClose();
      }
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      <Modal transparent={true} visible={true} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <View
            style={[
              styles.modalOverlay,
              {
                backgroundColor: theme.colors.modalOverlay,
                opacity: 0.7,
              },
            ]}
          />
        </Pressable>
        <Animated.View
          entering={SlideInDown.springify().damping(19).stiffness(140)}
          exiting={SlideOutDown.springify().damping(19).stiffness(140)}
          style={styles.focusedNoteContainer}
        >
          <Box
            style={styles.focusedNote}
            variant="nestedContainer"
            shadowColor="modalShadow"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={1}
            shadowRadius={8}
          >
            <TextInput
              placeholder="Add a note..."
              value={value}
              onChangeText={setValue}
              placeholderTextColor={theme.colors.placeholderTextColor}
              style={[styles.textInput, { color: theme.colors.mainText }]}
              autoFocus
              multiline
            />
            {note && (
              <Text
                style={styles.editedFootnote}
                fontSize={14}
                color="quinaryText"
              >
                {`Last edited ${dayjs(note.datetime).format(
                  'MMM D, YYYY h:mm A'
                )}`}
              </Text>
            )}
            <Button
              label="save"
              textColor="blueText"
              onPress={() => onSubmit(value)}
              fontSize={18}
              style={styles.confirmIconButton}
            />
          </Box>
        </Animated.View>
      </Modal>
    </>
  );
};

const NoteRow = ({
  note,
  onPress,
  onDelete,
  disabled,
}: {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  disabled: boolean;
}) => {
  const { data: coowner } = useGetCoOwnerQuery();
  const { data: user } = useGetMeQuery();

  return (
    <SwipeDelete onDeleted={onDelete}>
      <Box backgroundColor="nestedContainer" marginVertical="s">
        <View style={styles.noteSeperator}>
          <Seperator
            variant="bare"
            backgroundColor="nestedContainerSeperator"
          />
        </View>
        <TouchableOpacity
          style={styles.noteRow}
          activeOpacity={0.6}
          disabled={disabled}
          onPress={onPress}
        >
          {note.is_current_users ? (
            <Avatar size="s" name={coowner?.name} />
          ) : (
            <Avatar name={user?.name} size="s" />
          )}
          <Text>{note.text}</Text>
        </TouchableOpacity>
      </Box>
    </SwipeDelete>
  );
};

const Notes = ({
  transaction,
  isInModal,
}: {
  transaction: Transaction;
  isInModal?: boolean;
}) => {
  const [addNote, { isLoading: isAddingNote, data: addedNote, reset }] =
    useAddNoteMutation();
  const [updateDeleteNote, { isLoading: isUpdatingNote }] =
    useUpdateDeleteNoteMutation();
  const theme = useTheme();
  const [maxHeight, setMaxHeight] = useState(0);

  const [focusedNote, setFocusedNote] = useState<Note | null>();
  const [notes, setNotes] = useState<Note[]>(
    transaction.notes.map((n) => ({
      ...n,
      localId: Math.random().toString().slice(2, 9),
    }))
  );

  useEffect(() => {
    if (addedNote) {
      setNotes((prev) =>
        prev.map((n) => (n.id === 'new' ? { ...n, id: addedNote.id } : n))
      );
      const t = setTimeout(() => {
        reset();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [addedNote]);

  const handleSubmit = (text: string) => {
    if (!text && focusedNote === null) return;
    if (focusedNote === null) {
      addNote({
        transactionId: transaction.transaction_id,
        text: text,
      });
      setNotes((prev) => [
        {
          id: 'new',
          datetime: new Date().toISOString(),
          text: text,
          is_current_users: true,
          localId: Math.random().toString().slice(2, 9),
        },
        ...prev,
      ]);
    } else if (focusedNote) {
      updateDeleteNote({
        transactionId: transaction.transaction_id,
        noteId: focusedNote.id,
        text: text,
      });
      setNotes((prev) => {
        if (text) {
          return prev.map((note) =>
            note.id === focusedNote.id
              ? {
                  ...note,
                  text,
                }
              : note
          );
        } else {
          return prev.filter((note) => note.id !== focusedNote.id);
        }
      });
    }
    setFocusedNote(undefined);
  };

  const transitions = useTransition(
    notes
      .slice()
      .sort((a, b) => (dayjs(a.datetime).isAfter(b.datetime) ? -1 : 1)),
    {
      keys: (note) => note.localId,
      from: { maxHeight: 300 },
      enter: { maxHeight: 300 },
      leave: { maxHeight: 0 },
      immediate: Boolean(addedNote),
    }
  );

  return (
    <Animated.View layout={LinearTransition} style={styles.notesBoxContainer}>
      <BoxHeader>Notes</BoxHeader>
      <View
        style={styles.notesBoxContainer}
        onLayout={(e) =>
          setMaxHeight(
            e.nativeEvent.layout.height - theme.spacing.navHeight - 4
          )
        }
      >
        {focusedNote !== undefined && (
          <NoteModal
            note={focusedNote}
            onSubmit={handleSubmit}
            onClose={() => setFocusedNote(undefined)}
          />
        )}
        <Box
          variant="nestedContainer"
          backgroundColor={isInModal ? 'modalNestedContainer' : undefined}
          style={[styles.notesBox, { maxHeight }]}
        >
          <CustomScrollView style={styles.notesContainer}>
            <TouchableOpacity
              style={styles.addNoteButton}
              activeOpacity={0.6}
              onPress={() => setFocusedNote(null)}
            >
              <Text color="placeholderText">Add a note...</Text>
            </TouchableOpacity>
            {transitions((style, note) => (
              <AnimatedView style={style}>
                <NoteRow
                  onPress={() => setFocusedNote(note)}
                  note={note}
                  disabled={
                    isAddingNote || isUpdatingNote || !note.is_current_users
                  }
                  onDelete={() => {
                    setNotes((prev) => prev.filter((n) => n.id !== note.id));
                    updateDeleteNote({
                      transactionId: transaction.transaction_id,
                      noteId: note.id,
                      text: '',
                    });
                  }}
                />
              </AnimatedView>
            ))}
          </CustomScrollView>
        </Box>
      </View>
    </Animated.View>
  );
};

export default Notes;
