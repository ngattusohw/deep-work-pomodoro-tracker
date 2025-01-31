import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';
import { Slider, Icon } from '@rneui/themed';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CompletePomModal({
  handleSessionComplete,
  showCompletionModal,
  setFocusLevel,
  focusLevel,
}) {
  return (
    <Modal
      visible={showCompletionModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Focus Session Complete</Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <Text>Excellent</Text>
              <Text>Good</Text>
              <Text>Fair</Text>
              <Text>Poor</Text>
              <Text>Terrible</Text>
            </View>
            <View style={styles.verticalContent}>
              <Slider
                value={focusLevel}
                onValueChange={value => setFocusLevel(value)}
                minimumValue={1}
                maximumValue={10}
                maximumTrackTintColor="#0c69ab"
                minimumTrackTintColor="gray"
                step={1}
                orientation="vertical"
                thumbStyle={{
                  height: 20,
                  width: 16,
                  backgroundColor: 'transparent',
                }}
                thumbTouchSize={{ width: 40, height: 40 }}
                thumbProps={{
                  children: (
                    <Icon
                      name="chevron-expand"
                      type="ionicon"
                      size={20}
                      reverse
                      containerStyle={{ bottom: 20, right: 20 }}
                      color="#0c69ab"
                    />
                  ),
                }}
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <Icon
                name="smiley"
                type="fontisto"
                size={20}
                reverse
                color="#0cc248"
              />
              <Icon
                name="slightly-smile"
                type="fontisto"
                size={20}
                reverse
                color="#e6cd10"
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#94938e',
                  borderRadius: 25,
                  width: 46,
                  height: 46,
                  margin: 5,
                }}
              >
                <FontAwesome6 name="face-meh" size={20} color="white" />
              </View>
              <Icon
                name="frowning"
                type="fontisto"
                size={20}
                reverse
                color="#de6f3c"
              />
              <Icon
                name="emoticon-dead"
                type="material-community"
                size={20}
                reverse
                color="#9a5ae8"
              />
            </View>
          </View>
          <View style={styles.modalButtons}>
            <Button
              title="Submit"
              style={[styles.button, styles.successButton]}
              onPress={() => handleSessionComplete(true)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
    width: '100%',
  },
  successButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  // verticalContent: {
  //   padding: 20,
  //   flex: 1,
  //   flexDirection: 'row',
  //   height: 500,
  //   justifyContent: 'center',
  //   alignItems: 'stretch',
  // },
  contentView: {
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  verticalContent: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    height: 500,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  subHeader: {
    backgroundColor: '#2089dc',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
    marginBottom: 10,
  },
});
