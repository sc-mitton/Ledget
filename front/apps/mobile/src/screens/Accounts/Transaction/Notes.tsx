import { useEffect, useState, useRef } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Modal,
  Pressable
} from "react-native";
import { useTheme } from "@shopify/restyle";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  SlideOutDown,
  SlideInDown
} from 'react-native-reanimated';
import { ArrowLeft } from 'geist-native-icons';
import { useTransition } from '@react-spring/web';
import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';

import styles from "./styles/notes";
import {
  BoxHeader,
  Box,
  Avatar,
  Text,
  CustomScrollView,
  defaultSpringConfig,
  Seperator,
  Button,
  Icon,
  AnimatedView
} from "@ledget/native-ui";
import {
  Transaction,
  useAddNoteMutation,
  useUpdateDeleteNoteMutation,
  Note as NoteT,
  useGetCoOwnerQuery,
  useGetMeQuery
} from "@ledget/shared-features";

interface Note extends NoteT {
  localId: string;
}

const FocusedNote = ({ note, onSubmit, onClose }: {
  note: Note | null;
  onSubmit: (text: string) => void;
  onClose: () => void
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(note?.text || '');
  const overlayOpacity = useSharedValue(0);
  return (
    <>
      <Modal
        transparent={true}
        visible={true}
        animationType='fade'
      >
        <Pressable style={styles.modalOverlay} onPress={onClose} >
          <View
            style={[
              styles.modalOverlay,
              {
                backgroundColor: theme.colors.modalOverlay,
                opacity: .7
              }
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
            variant='nestedContainer'
            shadowColor='modalShadow'
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={1}
            shadowRadius={8}
          >
            <TextInput
              placeholder='Add a note...'
              value={value}
              onChangeText={setValue}
              placeholderTextColor={theme.colors.placeholderTextColor}
              style={[styles.textInput, { color: theme.colors.mainText }]}
              autoFocus
              multiline
            />
            {note &&
              <Text style={styles.editedFootnote} fontSize={14} color='quinaryText'>
                {`Last edited ${dayjs(note.datetime).format('MMM D, YYYY h:mm A')}`}
              </Text>}
            <Button
              label='save'
              textColor='blueText'
              onPress={() => onSubmit(value)}
              fontSize={18}
              style={styles.confirmIconButton}
            />
          </Box>
        </Animated.View>
      </Modal>
    </>
  )
}

const NoteRow = ({ note, onPress, onDelete, disabled }: { note: Note, onPress: () => void, onDelete: () => void, disabled: boolean }) => {
  const { data: coowner } = useGetCoOwnerQuery();
  const { data: user } = useGetMeQuery();
  const itemDimensions = useRef({ height: 0, width: 0 });
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => false,
    onStartShouldSetPanResponderCapture: (evt, gs) => false,
    onMoveShouldSetPanResponder: (evt, gs) => Math.abs(gs.vx) > Math.abs(gs.vy),
    onMoveShouldSetPanResponderCapture: (evt, gs) => false,
    onShouldBlockNativeResponder: () => false,
    onPanResponderMove: (event, gs) => {
      if (translateX.value <= 0) {
        translateX.value = gs.dx;
      }
      if (Math.abs(gs.dx) > itemDimensions.current.width / 2 || Math.abs(gs.vx) > 1.5) {
        console.log(Dimensions.get('window').width * -1)
        translateX.value = withSpring(Dimensions.get('window').width * -1, defaultSpringConfig);
        opacity.value = 0;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onDelete();
      }
    },
    onPanResponderTerminate: (evt, gs) => {
      if (Math.abs(gs.dx) < itemDimensions.current.width / 2 && Math.abs(gs.vx) < 1.5) {
        translateX.value = withSpring(1, defaultSpringConfig);
      }
    },
    onPanResponderRelease: (evt, gs) => {
      if (Math.abs(gs.dx) < itemDimensions.current.width / 2 && Math.abs(gs.vx) < 1.5) {
        translateX.value = withSpring(1, defaultSpringConfig);
      }
    }
  });

  const animation = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const iconAnimation = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <View {...panResponder.panHandlers} style={styles.noteRowContainer}>
        <Animated.View style={[animation]}>
          <View style={styles.noteSeperator}><Seperator /></View>
          <Box backgroundColor='nestedContainer' marginVertical='s'>
            <TouchableOpacity
              onLayout={(e) => {
                itemDimensions.current = { width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height };
              }}
              style={styles.noteRow}
              activeOpacity={.6}
              disabled={disabled}
              onPress={onPress}
            >
              {note.is_current_users
                ? <Avatar size='s' name={coowner?.name} />
                : <Avatar name={user?.name} size='s' />}
              <Text>{note.text}</Text>
            </TouchableOpacity>
          </Box>
        </Animated.View>
        <Animated.View style={[styles.trashIcon, iconAnimation]}>
          <Icon icon={ArrowLeft} color='alert' size={18} />
          <Text color='alert' fontSize={14}>Delete</Text>
        </Animated.View>
      </View>
    </>
  );
};

const Notes = ({ transaction }: { transaction: Transaction }) => {
  const [addNote, { isLoading: isAddingNote, data: addedNote, reset }] = useAddNoteMutation();
  const [updateDeleteNote, { isLoading: isUpdatingNote }] = useUpdateDeleteNoteMutation();
  const theme = useTheme();
  const [maxHeight, setMaxHeight] = useState(0);

  const [focusedNote, setFocusedNote] = useState<Note | null>();
  const [notes, setNotes] = useState<Note[]>(
    transaction.notes.map(n => ({ ...n, localId: Math.random().toString().slice(2, 9) })));

  useEffect(() => {
    if (addedNote) {
      setNotes(prev => prev.map(n => n.id === 'new'
        ? { ...n, id: addedNote.id }
        : n
      ))
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
      })
      setNotes(prev => [
        {
          id: 'new',
          datetime: new Date().toISOString(),
          text: text,
          is_current_users: true,
          localId: Math.random().toString().slice(2, 9)
        },
        ...prev
      ])
    } else if (focusedNote) {
      updateDeleteNote({
        transactionId: transaction.transaction_id,
        noteId: focusedNote.id,
        text: text,
      })
      setNotes(prev => {
        if (text) {
          return prev.map(note => note.id === focusedNote.id ? {
            ...note, text
          } : note)
        } else {
          return prev.filter(note => note.id !== focusedNote.id)
        }
      })
    }
    setFocusedNote(undefined);
  }

  const transitions = useTransition(notes
    .slice()
    .sort((a, b) => dayjs(a.datetime).isAfter(b.datetime) ? -1 : 1),
    {
      keys: (note) => note.localId,
      from: { maxHeight: 300 },
      enter: { maxHeight: 300 },
      leave: { maxHeight: 0 },
      immediate: Boolean(addedNote)
    });

  return (
    <>
      <BoxHeader>Notes</BoxHeader>
      <View
        style={styles.notesBoxContainer}
        onLayout={(e) => setMaxHeight(e.nativeEvent.layout.height - theme.spacing.navHeight - 4)}
      >
        {(focusedNote !== undefined) &&
          <FocusedNote note={focusedNote} onSubmit={handleSubmit} onClose={() => setFocusedNote(undefined)} />}
        <Box variant='nestedContainer' style={[styles.notesBox, { maxHeight }]}>
          <CustomScrollView style={styles.notesContainer}>
            <TouchableOpacity style={styles.addNoteButton} activeOpacity={.6} onPress={() => setFocusedNote(null)}>
              <Text color='placeholderText'>Add a note...</Text>
            </TouchableOpacity>
            {transitions((style, note) =>
              <AnimatedView style={style}>
                <NoteRow
                  onPress={() => setFocusedNote(note)}
                  note={note}
                  disabled={isAddingNote || isUpdatingNote || !note.is_current_users}
                  onDelete={() => {
                    setNotes(prev => prev.filter(n => n.id !== note.id));
                    updateDeleteNote({
                      transactionId: transaction.transaction_id,
                      noteId: note.id,
                      text: '',
                    });
                  }}
                />
              </AnimatedView>
            )}
          </CustomScrollView>
        </Box>
      </View>
    </>
  )
}

export default Notes;
