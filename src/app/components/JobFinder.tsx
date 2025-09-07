'use client';

import { useState } from 'react';
import { getJobs } from '../actions';
import JobCard from './JobCard';
import { Form, Input, Select, Slider, Button, Row, Col, Spin, Empty, Result } from 'antd';
import { UserOutlined, CodeOutlined, BankOutlined, MoneyCollectOutlined, GiftOutlined } from '@ant-design/icons';
import { Job } from '../lib/types';

const { Option } = Select;

interface FormValues {
  qualifications: string;
  major?: string;
  aspirations?: string;
  workType: 'any' | 'Remote' | 'Hybrid' | 'On-site';
  salary?: string;
  desiredBenefits?: string;
  wlbPreference: number;
}

export default function JobFinder() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    setSearched(false);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI thinking time

    const formData = new FormData();
    (Object.keys(values) as Array<keyof FormValues>).forEach((key) => {
      const value = values[key];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const recommendedJobs = await getJobs(formData);
    setJobs(recommendedJobs);
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="apple-card mb-16 p-20">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ workType: 'any', wlbPreference: 3, desiredBenefits: '' }}
        >
           <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="qualifications" label="Keahlian Inti Anda" rules={[{ required: true, message: 'Masukkan setidaknya satu keahlian!' }]}>
                <Input prefix={<CodeOutlined />} placeholder="cth: JavaScript, Figma, SEO" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="major" label="Latar Belakang Pendidikan">
                <Input prefix={<UserOutlined />} placeholder="cth: Ilmu Komputer, DKV" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name="aspirations" label="Industri Impian">
                <Input prefix={<BankOutlined />} placeholder="cth: Teknologi, Edukasi" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item name="salary" label="Ekspektasi Gaji (IDR)">
                    <Input
                        prefix={<MoneyCollectOutlined />}
                        placeholder="10.000.000"
                        size="large"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="workType" label="Preferensi Tipe Kerja">
                <Select size="large">
                  <Option value="any">Bebas</Option>
                  <Option value="remote">Remote</Option>
                  <Option value="hybrid">Hybrid</Option>
                  <Option value="onsite">On-site</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="desiredBenefits" label="Benefit Incaran (pisahkan dengan koma)">
            <Input prefix={<GiftOutlined />} placeholder="cth: Asuransi, Bonus, Remote" size="large" />
          </Form.Item>

          <Form.Item name="wlbPreference" label="Prioritas Work-Life Balance (1: Santai, 5: Sangat Penting)">
              <Slider 
                  min={1} max={5} 
                  marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
              />
          </Form.Item>

          <Form.Item className="text-center mt-8">
            <Button type="primary" htmlType="submit" loading={loading} className="apple-button h-auto">
              {loading ? 'Menganalisis...' : 'Temukan Jodoh Karierku'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      {loading && (
          <div className="text-center py-24">
              <Spin size="large" tip="AI sedang menganalisis profil Anda..."></Spin>
          </div>
      )}

      {searched && !loading && jobs && jobs.length > 0 && (
          <div className="gap-20">
          {jobs.map(job => (
              <JobCard key={job.id} job={job} />
          ))}
          </div>
      )}

      {searched && !loading && (!jobs || jobs.length === 0) && (
          <div className="text-center py-16 apple-card">
              <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                      <span className="text-gray-500 text-lg">Maaf, AI belum menemukan yang cocok.</span>
                  }
              >
                  <Button type="primary" onClick={() => { form.resetFields(); setSearched(false); }} className="apple-button">
                      Ulangi Pencarian
                  </Button>
              </Empty>
          </div>
      )}
    </div>
  );
}
