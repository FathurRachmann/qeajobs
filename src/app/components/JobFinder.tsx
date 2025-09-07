'use client';

import { useState } from 'react';
import { getJobs } from '../actions';
import JobCard from './JobCard';
import { Form, Input, Select, InputNumber, Checkbox, Button, Row, Col, Spin, Empty, Card } from 'antd';
import { UserOutlined, CodeOutlined, BankOutlined, AppstoreOutlined, MoneyCollectOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function JobFinder() {
  const [jobs, setJobs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    setSearched(false);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const formData = new FormData();
    for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
        }
    }
    
    const recommendedJobs = await getJobs(formData);
    setJobs(recommendedJobs);
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="glassmorphism mb-16 p-4 md:p-8">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Ceritakan Tentang Diri Anda</h2>
            <p className="text-gray-400">AI kami akan menganalisis profil unik Anda untuk menemukan peluang terbaik.</p>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ workType: 'any', flexibleHours: false }}
        >
           <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="qualifications" label="Keahlian Inti" rules={[{ required: true, message: 'Masukkan setidaknya satu keahlian!' }]}>
                <Input prefix={<CodeOutlined className="text-gray-400"/>} placeholder="cth: JavaScript, Figma, SEO" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="major" label="Latar Belakang Pendidikan">
                <Input prefix={<UserOutlined className="text-gray-400"/>} placeholder="cth: Ilmu Komputer, DKV" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name="aspirations" label="Industri Impian">
                <Input prefix={<BankOutlined className="text-gray-400"/>} placeholder="cth: Teknologi, Edukasi" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="workType" label="Preferensi Kerja">
                <Select size="large">
                  <Option value="any">Bebas</Option>
                  <Option value="Remote">Remote</Option>
                  <Option value="Hybrid">Hybrid</Option>
                  <Option value="On-site">On-site</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item name="salary" label="Ekspektasi Gaji (IDR)">
                    <InputNumber
                        className="w-full"
                        prefix={<MoneyCollectOutlined className="text-gray-400"/>}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value!.replace(/\./g, '')}
                        placeholder="10.000.000"
                        size="large"
                    />
                </Form.Item>
            </Col>
          </Row>

          <Form.Item name="flexibleHours" valuePropName="checked" className="text-center mt-6">
            <Checkbox><span className="text-gray-300">Saya memprioritaskan jam kerja yang fleksibel</span></Checkbox>
          </Form.Item>

          <Form.Item className="text-center mt-8">
            <Button type="primary" htmlType="submit" loading={loading} size="large" className="glow-button bg-gradient-to-r from-purple-600 to-pink-600 border-none font-bold px-12 py-6 flex items-center justify-center mx-auto h-auto">
              {loading ? 'AI Sedang Berpikir...' : 'Temukan Jodoh Karierku'}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {loading && (
          <div className="text-center py-24">
              <Spin size="large" tip="Menganalisis profil Anda dengan matriks kuantum..."></Spin>
          </div>
      )}

      {searched && !loading && jobs && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map(job => (
              <JobCard key={job.id} job={job} />
          ))}
          </div>
      )}

      {searched && !loading && (!jobs || jobs.length === 0) && (
          <div className="text-center py-16 glassmorphism">
              <Empty
                  description={
                      <span className="text-gray-400 text-lg">Yah, AI belum menemukan yang pas.</span>
                  }
              >
                  <Button type="primary" onClick={() => { form.resetFields(); setSearched(false); }} className="glow-button bg-gradient-to-r from-purple-600 to-pink-600 border-none font-bold">
                      Coba Lagi Dengan Kriteria Berbeda
                  </Button>
              </Empty>
          </div>
      )}
    </div>
  );
}
