import React from "react";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux'
import moment from "moment";
import { Link } from 'react-router-native';
import { View, ScrollView, StyleSheet, Image, Text, TextInput, TouchableOpacity } from "react-native";
import driverPhoto from "../../../images/driver.png";
import sendMessageIcon from "../../../images/message.png";
import backIcon from "../../../images/back.png";
import { addComment } from "../modules/actionConstants";

class CommentView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            commentText: '',
            comments: this.props.comments.filter(comment => comment.driverId === this.props.currentDriver.id),
        };
    }

    addComment = () => {
        if (this.state.commentText.length > 0) {
            const comment = {
                commentDate: moment(new Date()).format('MMMM Do YYYY, h:mm:ss'),
                commentText: this.state.commentText,
                driverId: this.props.currentDriver.id,
            };

            this.setState({
                comments: [
                    ...this.state.comments,
                    comment,
                ],
                commentText: '',
            }, this.props.addComment(comment));
        }
    }

    handleChange = (commentText) => {
        console.log('text', commentText);
        this.setState({
            commentText,
        });
    }

    render(){
        const { comments, commentText } = this.state;
        console.log('this.props.comments', this.props.comments);

        return(
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Link to='/'>
                    <Image source={backIcon} style={{ width: 25, height: 25 }} />
                </Link>
                <View style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    padding: 10,
                    minHeight: 115,
                    maxHeight: 115,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                }}>
                    <Image style={{ width: 70, height: 70, borderRadius: 35 }} source={driverPhoto}/>
                    <Text style={{ flex:1, fontSize: 20, color: '#000'}}>{this.props.currentDriver.name}</Text>
                </View>
                <ScrollView  contentContainerStyle={{margin: 10, paddingBottom: 50 }}>
                    {comments.map((comment, index) => (
                        <View key={comment.commentText} style={{marginTop: 10, backgroundColor: 'rgba(0, 0, 0, 0.04)'}}>
                            <Text style={{ fontWeight: 'bold', fontSize:16, paddingLeft: 10}}>{`#${index+1} ${comment.commentDate}`}</Text> 
                            <View style={{ padding: 10, opacity: 0.8 }}>
                                <Text style={{color: '#000', fontSize: 16, }}>{comment.commentText}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <View style={{
                    flex: 1,
                    maxHeight: 55,
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                    position: 'absolute',
                    bottom: 0,
                    width: 360,
                }}>
                    <TextInput
                        style={{flex: 0.95, backgroundColor: '#FFF' }}
                        value={commentText}
                        multiline
                        onChangeText={this.handleChange}
                        placeholder="Enter Comment"
                        placeholderTextColor='#000'
                    />
                    <TouchableOpacity onPress={this.addComment}>
                        <Image style={{ width: 25, height: 25 }} source={sendMessageIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        comments: state.home.comments,
        currentDriver: state.home.currentDriver,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addComment: bindActionCreators(addComment, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentView);