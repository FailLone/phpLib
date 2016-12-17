import React, {Component} from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { isEqual } from 'lodash';

const FormItem = Form.Item;

class Config extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = (e) => {
      e.preventDefault();
      this.props.fetchSetConfig(
        this.props.form.getFieldsValue()
      );
    };
  }
  componentDidMount() {
    this.props.fetchGetConfig();
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.config.config, nextProps.config.config)) {
      this.props.form.setFieldsValue(nextProps.config.config);
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 4 }
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='服务名称'
        >
          {getFieldDecorator('connect_timeout_ratio')(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='连接超时'
          wrapperCol={{ span: 8 }}
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha1')(
                <Input addonBefore='延时' size='large' />
              )}
            </Col>
            <Col span={12}>
              {getFieldDecorator('captcha2')(
                <Input addonBefore='占比' addonAfter={'%'} size='large' />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='读超时'
          wrapperCol={{ span: 8 }}
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha3')(
                <Input addonBefore='延时' size='large' />
              )}
            </Col>
            <Col span={12}>
              {getFieldDecorator('captcha4')(
                <Input addonBefore='占比' addonAfter={'%'} size='large' />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem wrapperCol={{ span: 16, offset: 8 }}>
          <Button type='primary' htmlType='submit' size='large'>{'Submit'}</Button>
        </FormItem>
      </Form>
    );
  }
}

Config.propTypes = {
};

export default Form.create()(Config);
